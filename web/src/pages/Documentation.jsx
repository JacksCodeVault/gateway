import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Smartphone, Server, Database } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { forwardRef, useRef } from "react"
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';

const Circle = forwardRef(({ className, children, label }, ref) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-16 items-center justify-center rounded-full border-2 bg-background p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className
        )}
      >
        {children}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
})

Circle.displayName = "Circle"

/* const FlowDiagram = () => {
  const containerRef = useRef(null)
  const webAppRef = useRef(null)
  const serverRef = useRef(null) 
  const mobileRef = useRef(null)
  const databaseRef = useRef(null)

  return (
    <div
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10"
      ref={containerRef}
    >
      <div className="flex size-full max-w-2xl items-center justify-between">
        <Circle ref={webAppRef} className="bg-primary/10" label="Web App">
          <MessageSquare className="h-8 w-8" />
        </Circle>
        
        <Circle ref={serverRef} className="bg-primary/10" label="Server">
          <Server className="h-8 w-8" />
        </Circle>

        <Circle ref={mobileRef} className="bg-primary/10" label="Mobile Device">
          <Smartphone className="h-8 w-8" />
        </Circle>

        <Circle ref={databaseRef} className="bg-primary/10" label="Database">
          <Database className="h-8 w-8" />
        </Circle>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={webAppRef}
        toRef={serverRef}
        curvature={-30}
      />
      <AnimatedBeam 
        containerRef={containerRef}
        fromRef={serverRef}
        toRef={mobileRef}
        curvature={30}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={serverRef}
        toRef={databaseRef}
        curvature={-30}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={mobileRef}
        toRef={serverRef}
        curvature={30}
        reverse
      />
    </div>
  )
} */

const EventFlowDiagram = () => {
  const nodes = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: { label: 'Web App' },
      type: 'input',
    },
    {
      id: '2',
      position: { x: 250, y: 0 },
      data: { label: 'Server' },
    },
    {
      id: '3',
      position: { x: 500, y: 0 },
      data: { label: 'Mobile Device' },
    },
    {
      id: '4',
      position: { x: 250, y: 200 },
      data: { label: 'Database' },
      type: 'output',
    },
  ];

  const edges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      label: 'Send SMS Request',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      label: 'FCM Notification',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      label: 'Store SMS',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e3-2',
      source: '3',
      target: '2',
      label: 'Status Update',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    },
  ];

  return (
    <div className="h-[400px] w-full border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

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

          {/* <FlowDiagram /> */}

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Event Flow Diagram</h2>
            <EventFlowDiagram />
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
