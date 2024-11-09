import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import AppRoutes from "./routes/AppRoutes"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App