import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import authService from "@/services/authService"

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authService.resetPassword(email)
      setResetSent(true)
      toast.success('Password reset instructions sent to your email')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg border"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-muted-foreground mt-2">
            {resetSent 
              ? "Check your email for reset instructions" 
              : "Enter your email to reset your password"}
          </p>
        </div>

        {!resetSent ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        ) : (
          <Button className="w-full" variant="outline" asChild>
            <Link to="/login">Return to Login</Link>
          </Button>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
