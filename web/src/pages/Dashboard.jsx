import { useEffect, useState } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { BarChart, MessageSquare, Smartphone, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import gatewayService from "@/services/gatewayService"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDevices: 0,
    totalSentSMS: 0,
    totalReceivedSMS: 0
  })
  const [devices, setDevices] = useState([])
  const [receivedMessages, setReceivedMessages] = useState([])
  const [selectedDevice, setSelectedDevice] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [messageForm, setMessageForm] = useState({
    deviceId: '',
    recipient: '',
    message: ''
  })
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedDevice) {
      loadReceivedMessages(selectedDevice)
    }
  }, [selectedDevice])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const [statsData, devicesData] = await Promise.all([
        gatewayService.getStats(),
        gatewayService.getDevices()
      ])
      setStats(statsData.data)
      setDevices(devicesData.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const loadReceivedMessages = async (deviceId) => {
    try {
      const response = await gatewayService.getReceivedSMS(deviceId)
      setReceivedMessages(response.data || [])
    } catch (error) {
      toast.error('Failed to load received messages')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!messageForm.deviceId || !messageForm.recipient || !messageForm.message) {
      toast.error('Please fill all fields')
      return
    }

    setIsSending(true)
    try {
      await gatewayService.sendSMS(messageForm.deviceId, {
        recipient: messageForm.recipient,
        message: messageForm.message
      })
      
      toast.success('Message sent successfully')
      setMessageForm({
        deviceId: '',
        recipient: '',
        message: ''
      })
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
              Total Messages Sent
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSentSMS}</div>
            <p className="text-xs text-muted-foreground">
              Messages sent through platform
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
            <div className="text-2xl font-bold">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              Active devices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages Received
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReceivedSMS}</div>
            <p className="text-xs text-muted-foreground">
              Total received messages
            </p>
          </CardContent>
        </Card>

{/*         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Message delivery rate
            </p>
          </CardContent>
        </Card> */}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8"
      >
        <Tabs defaultValue="send" className="space-y-4">
          <TabsList>
            <TabsTrigger value="send">Send Message</TabsTrigger>
            <TabsTrigger value="receive">Received Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>Send SMS through selected device</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Device</Label>
                    <Select
                      value={messageForm.deviceId}
                      onValueChange={(value) => setMessageForm({...messageForm, deviceId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a device" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map(device => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Recipient</Label>
                    <Input 
                      placeholder="Enter phone number"
                      value={messageForm.recipient}
                      onChange={(e) => setMessageForm({...messageForm, recipient: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea 
                      placeholder="Type your message here..."
                      value={messageForm.message}
                      onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                    />
                  </div>

                  <Button type="submit" disabled={isSending}>
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receive">
            <Card>
              <CardHeader>
                <CardTitle>Received Messages</CardTitle>
                <CardDescription>View messages received by devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select
                      value={selectedDevice}
                      onValueChange={setSelectedDevice}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a device" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map(device => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => loadReceivedMessages(selectedDevice)}
                      disabled={!selectedDevice}
                    >
                      Refresh Messages
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>From</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Received At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
  {receivedMessages.map((msg) => (
    <TableRow key={msg.id}>
      <TableCell>{msg.sender}</TableCell>
      <TableCell>{msg.message}</TableCell>
      <TableCell>{new Date(msg.receivedAt).toLocaleString()}</TableCell>
    </TableRow>
  ))}
</TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  )
}
