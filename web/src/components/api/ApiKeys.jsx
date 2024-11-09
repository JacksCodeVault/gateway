import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Key, Copy, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function ApiKeys() {
  const [newApiKey, setNewApiKey] = useState(null)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleGenerateApiKey = () => {
    const generatedKey = 'sk_' + Math.random().toString(36).substr(2, 32)
    setNewApiKey(generatedKey)
    setShowApiKey(true)
    toast.success('New API key generated successfully')
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(newApiKey)
    toast.success('API key copied to clipboard')
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
            <Button onClick={handleGenerateApiKey}>
              <Key className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {newApiKey && (
            <Alert className="mb-4">
              <AlertDescription className="flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {showApiKey ? newApiKey : '••••••••••••••••••••••••••••••••'}
                </code>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyApiKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
