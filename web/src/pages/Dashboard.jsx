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
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Textarea } from "@/components/ui/textarea"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import { BarChart, MessageSquare, Key, Smartphone, Copy, Eye, EyeOff, Send } from "lucide-react"
  import { Alert, AlertDescription } from "@/components/ui/alert"
  import { toast } from "sonner"

  export default function Dashboard() {
    const [receivedMessages] = useState([
      { id: 1, sender: '+1234567890', message: 'Yes, I received it', receivedAt: '2024-03-08 14:30' },
      { id: 2, sender: '+0987654321', message: 'Thanks for the update', receivedAt: '2024-03-08 15:45' },
    ])

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

    const handleSendMessage = (e) => {
      e.preventDefault()
      toast.success('Message sent successfully')
    }

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Messages Sent
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                API Keys
              </CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                3 active keys
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Connected Devices
              </CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                2 online now
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Delivery Rate
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">
                +2.4% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Send and receive messages</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="send" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="send">Send Message</TabsTrigger>
                  <TabsTrigger value="receive">Received Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="send">
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient</Label>
                      <Input id="recipient" placeholder="Enter phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Type your message here" />
                    </div>
                    <Button type="submit">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="receive">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sender</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Received At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receivedMessages.map((msg) => (
                        <TableRow key={msg.id}>
                          <TableCell>{msg.sender}</TableCell>
                          <TableCell>{msg.message}</TableCell>
                          <TableCell>{msg.receivedAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </>
    )
  }