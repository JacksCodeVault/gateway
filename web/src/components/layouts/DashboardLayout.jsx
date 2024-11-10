import { useEffect } from "react"
import Navbar from "@/components/common/Navbar"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayout({ children }) {
  const { user, checkAuth } = useAuth()
  const userData = user?.data || {}

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 pt-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome back, {userData.name}</h1>
          <p className="text-muted-foreground mt-1">{userData.email}</p>
          <p className="text-sm text-muted-foreground">
            Member since: {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>
        {children}
      </main>
    </div>
  )
}
