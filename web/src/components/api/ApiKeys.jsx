import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Key, Copy, Eye, EyeOff, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import authService from "@/services/authService"

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([])
  const [newApiKey, setNewApiKey] = useState(null)
  const [visibleKeys, setVisibleKeys] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      const keys = await authService.getApiKeys()
      const activeKeys = keys.map(key => ({
        ...key,
        status: key.status || 'active'
      }))
      setApiKeys(activeKeys)
    } catch (error) {
      toast.error('Failed to load API keys')
    } finally {
      setIsLoading(false)
    }
  }
  
  

  const handleGenerateApiKey = async () => {
    setIsGenerating(true)
    try {
      const generatedKey = await authService.generateApiKey()
      setNewApiKey(generatedKey)
      setApiKeys(prev => [...prev, generatedKey])
      setVisibleKeys(prev => ({ ...prev, [generatedKey.id]: true }))
      toast.success('New API key generated. Save it now - it won\'t be shown again.')
    } catch (error) {
      toast.error('Failed to generate API key')
    } finally {
      setIsGenerating(false)
    }
  }
  

  const handleRevokeApiKey = async (keyId) => {
    try {
      await authService.revokeApiKey(keyId)
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
      toast.success('API key revoked successfully')
    } catch (error) {
      toast.error('Failed to revoke API key')
    }
  }

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const copyApiKey = (key) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Generate and manage your API keys</CardDescription>
            </div>
            <Button onClick={handleGenerateApiKey} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Generate New Key
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {newApiKey && (
            <Alert className="mb-4">
              <AlertDescription className="flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {visibleKeys[newApiKey.id] ? newApiKey.key : '••••••••••••••••••••••••••••••••'}
                </code>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleKeyVisibility(newApiKey.id)}
                  >
                    {visibleKeys[newApiKey.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyApiKey(newApiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-mono">
                    <div className="flex items-center space-x-2">
                      <span>
                        {visibleKeys[key.id] 
                          ? key.key
                          : `${key.key?.substring(0, 8)}................................${key.key?.substring(key.key?.length - 8)}`
                        }
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(key.id)}
                      >
                        {visibleKeys[key.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyApiKey(key.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(key.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
  <span className={`px-2 py-1 rounded-full text-xs ${
    key.status === 'active' ? 'bg-green-100 text-green-800' : 
    'bg-red-100 text-red-800'
  }`}>
    {key.status === 'active' ? 'Active' : 'Revoked'}
  </span>
</TableCell>

                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleRevokeApiKey(key.id)}
                      disabled={!key.active}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
