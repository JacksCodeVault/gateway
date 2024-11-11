  import { motion } from "framer-motion"
  import { ThemeToggle } from "@/components/theme-toggle"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { MessageSquare, Smartphone, Zap, Database } from "lucide-react"
  import { useNavigate } from "react-router-dom"

  export default function Documentation() {
    const navigate = useNavigate()

    return (
      <>
        <nav className="fixed w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-2xl font-bold"
            >
              OpenSMS Gateway
            </motion.div>
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <Button className="hidden sm:inline-flex" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold">API Documentation</h1>
              <p className="text-muted-foreground mt-2">
                Complete guide to integrating with OpenSMS Gateway
              </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sending">Sending SMS</TabsTrigger>
                <TabsTrigger value="receiving">Receiving SMS</TabsTrigger>
                <TabsTrigger value="devices">Device Management</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>System Overview</CardTitle>
                    <CardDescription>
                      Understanding the communication flow between web app and mobile devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-semibold">Firebase Cloud Messaging (FCM)</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Each mobile device registers with FCM and gets a unique fcmToken</li>
                      <li>Token is stored in the database with device registration</li>
                      <li>Web app uses this token to send notifications to specific devices</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sending">
                <Card>
                  <CardHeader>
                    <CardTitle>SMS Sending Flow</CardTitle>
                    <CardDescription>
                      How messages are sent from web app to mobile devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Process Flow:</h3>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Web app calls /api/v1/gateway/devices/{'{id}'}/sendSMS endpoint</li>
                        <li>Server creates SMS records in Firebase Database</li>
                        <li>Server sends FCM notification to device using its fcmToken</li>
                        <li>Mobile device receives FCM notification with SMS details</li>
                        <li>Mobile device sends the actual SMS using native capabilities</li>
                        <li>Mobile device reports back status through /receiveSMS endpoint</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="receiving">
                <Card>
                  <CardHeader>
                    <CardTitle>SMS Receiving Flow</CardTitle>
                    <CardDescription>
                      How messages received on mobile devices are synced to the web app
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Process Flow:</h3>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Mobile device receives SMS through native Android capabilities</li>
                        <li>Device calls /api/v1/gateway/devices/{'{id}'}/receiveSMS endpoint</li>
                        <li>Server stores received SMS in database</li>
                        <li>Web app can retrieve received messages through /getReceivedSMS endpoint</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="devices">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Management</CardTitle>
                    <CardDescription>
                      Managing and monitoring connected devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Devices register themselves through /devices endpoint</li>
                      <li>Web app can list, update, and manage devices</li>
                      <li>Each device is linked to a user account</li>
                      <li>Device status and statistics are tracked in real-time</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </>
    )
  }
