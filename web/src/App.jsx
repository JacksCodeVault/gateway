import { useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import AppRoutes from "./routes/AppRoutes"
import { useAuth } from "@/hooks/useAuth"

function App() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <AppRoutes />
    </ThemeProvider>
  )
}


export default App