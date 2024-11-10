import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import authService from "@/services/authService"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function UserSettings() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    createdAt: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await authService.getCurrentUser()
      setUserData(response)
    } catch (error) {
      toast.error('Failed to load user profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setIsUpdating(true)
    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      )
      toast.success('Password updated successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  // const handleDeleteAccount = async () => {
  //   if (!deletePassword) {
  //     toast.error('Please enter your password')
  //     return
  //   }

  //   setIsDeleting(true)
  //   try {
  //     await authService.deleteAccount(deletePassword)
  //     toast.success('Account deleted successfully')
  //     navigate('/login')
  //   } catch (error) {
  //     toast.error(error.message)
  //   } finally {
  //     setIsDeleting(false)
  //     setShowDeleteDialog(false)
  //     setDeletePassword('')
  //   }
  // }

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
    >
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={userData.email}
                    disabled
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label>Member Since</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })}
                  />
                </div>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="danger">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Please enter your password to confirm account deletion.
            </p>
            <Input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setDeletePassword('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </motion.div>
  )
}