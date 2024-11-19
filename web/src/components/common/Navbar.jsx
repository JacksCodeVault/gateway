import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { MessageSquare, Settings, Users, LogOut, Smartphone, Key, BarChart2 } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl md:text-2xl font-bold cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          OpenSMS Gateway
        </motion.div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant={location.pathname === '/dashboard' ? 'default' : 'ghost'} 
            className="flex items-center"
            onClick={() => navigate('/dashboard')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Button>
          {/* <Button 
            variant={location.pathname === '/dashboard/contacts' ? 'default' : 'ghost'}
            className="flex items-center"
            onClick={() => navigate('/dashboard/contacts')}
          >
            <Users className="mr-2 h-4 w-4" />
            Contacts
          </Button> */}
          <Button 
  variant={location.pathname === '/dashboard/api-keys' ? 'default' : 'ghost'}
  className="flex items-center"
  onClick={() => navigate('/dashboard/api-keys')}
>
  <Key className="mr-2 h-4 w-4" />
  API Keys
</Button>
          <Button 
            variant={location.pathname === '/dashboard/devices' ? 'default' : 'ghost'}
            className="flex items-center"
            onClick={() => navigate('/dashboard/devices')}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Devices
          </Button>
          <Button 
  variant={location.pathname === '/dashboard/reports' ? 'default' : 'ghost'}
  className="flex items-center"
  onClick={() => navigate('/dashboard/reports')}
>
  <BarChart2 className="mr-2 h-4 w-4" />
  Reports
</Button>
          <Button 
            variant={location.pathname === '/dashboard/settings' ? 'default' : 'ghost'}
            className="flex items-center"
            onClick={() => navigate('/dashboard/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            className="text-red-500"
            onClick={() => navigate('/login')}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
