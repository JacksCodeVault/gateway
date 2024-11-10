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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, Signal, Power, MoreVertical, Loader2, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import gatewayService from "@/services/gatewayService"

export default function ConnectedDevices() {
  const [devices, setDevices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [updatedName, setUpdatedName] = useState("")

  useEffect(() => {
    loadDevices()
  }, [])

  const loadDevices = async () => {
    try {
      const response = await gatewayService.getDevices()
      // Ensure we're setting an array of devices
      setDevices(response.data || [])
    } catch (error) {
      console.log('Device loading error:', error)
      toast.error('Failed to load devices')
      // Initialize with empty array if error occurs
      setDevices([])
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleUpdateDevice = async () => {
    try {
      await gatewayService.updateDevice(selectedDevice.id, { name: updatedName })
      setDevices(devices.map(device => 
        device.id === selectedDevice.id ? { ...device, name: updatedName } : device
      ))
      setIsUpdateDialogOpen(false)
      toast.success('Device updated successfully')
    } catch (error) {
      toast.error('Failed to update device')
    }
  }

  const handleDeleteDevice = async () => {
    try {
      await gatewayService.deleteDevice(selectedDevice.id)
      setDevices(devices.filter(device => device.id !== selectedDevice.id))
      setIsDeleteDialogOpen(false)
      toast.success('Device deleted successfully')
    } catch (error) {
      toast.error('Failed to delete device')
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
            {Array.isArray(devices) && devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Smartphone className="h-6 w-6" />
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
                      {device.battery}%
                      <span>• Last seen {new Date(device.lastSeen).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedDevice(device)
                      setUpdatedName(device.name)
                      setIsUpdateDialogOpen(true)
                    }}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedDevice(device)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update Device Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Device</DialogTitle>
            <DialogDescription>
              Change the name of your device
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name</Label>
              <Input
                id="name"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDevice}>
              Update Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Device Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this device? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDevice}>
              Delete Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
