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
import { Smartphone, Laptop, Signal, Power, MoreVertical } from "lucide-react"

export default function ConnectedDevices() {
  const [devices, setDevices] = useState([
    { 
      id: 1, 
      name: 'Samsung Galaxy S21', 
      type: 'smartphone',
      status: 'online',
      lastSeen: 'Now',
      battery: '85%'
    },
    { 
      id: 2, 
      name: 'iPhone 13', 
      type: 'smartphone',
      status: 'offline',
      lastSeen: '2 hours ago',
      battery: '20%'
    },
  ])

  const getDeviceIcon = (type) => {
    switch(type) {
      case 'smartphone':
        return <Smartphone className="h-6 w-6" />
      default:
        return <Laptop className="h-6 w-6" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
          <CardDescription>Manage your SMS gateway devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{device.name}</p>
                      <span className={`flex items-center text-xs ${device.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                        <Signal className="h-3 w-3 mr-1" />
                        {device.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Power className="h-3 w-3" />
                      {device.battery}
                      <span>• Last seen {device.lastSeen}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
