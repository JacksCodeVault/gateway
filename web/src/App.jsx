import { ThemeProvider } from "@/components/theme-provider"
import AppRoutes from "@/routes/AppRoutes"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App