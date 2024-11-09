import Navbar from "@/components/common/Navbar"

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 pt-24">
        {children}
      </main>
    </div>
  )
}
