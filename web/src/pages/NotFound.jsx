
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")} size="lg">
          Return Home
        </Button>
      </motion.div>
    </div>
  )
}
