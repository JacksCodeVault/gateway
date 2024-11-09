import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Shield, Zap, Users } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "@/components/common/Footer"

export default function Landing() {
  const navigate = useNavigate()

  const floatingIcons = [
    { icon: <MessageSquare className="h-6 w-6" />, x: -20, y: -15, delay: 0 },
    { icon: <Users className="h-6 w-6" />, x: 20, y: 20, delay: 0.2 },
    { icon: <MessageSquare className="h-4 w-4" />, x: 15, y: -25, delay: 0.4 },
    { icon: <Users className="h-4 w-4" />, x: -15, y: 15, delay: 0.6 },
    { icon: <MessageSquare className="h-6 w-6" />, x: -20, y: -15, delay: 0 },
    { icon: <Users className="h-6 w-6" />, x: 20, y: 20, delay: 0.2 },
    { icon: <MessageSquare className="h-4 w-4" />, x: 15, y: -25, delay: 0.4 },
    { icon: <Users className="h-4 w-4" />, x: -15, y: 15, delay: 0.6 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl md:text-2xl font-bold"
          >
            OpenSMS Gateway
          </motion.div>
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <Button className="hidden sm:inline-flex" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-6 lg:px-8 pt-24">
        <section className="py-12 md:py-24 relative">
          {/* Floating Icons */}
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className="absolute text-primary/40"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                x: [0, item.x, 0],
                y: [0, item.y, 0]
              }}
              transition={{
                duration: 3,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${50 + (index * 10)}%`,
                top: `${30 + (index * 5)}%`
              }}
            >
              {item.icon}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-[85rem] text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">
              Open Source SMS Gateway for Everyone
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg leading-7 md:leading-8 text-muted-foreground max-w-2xl mx-auto">
              A powerful, scalable, and easy-to-use SMS gateway solution that puts you in control of your messaging infrastructure.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => window.open("https://github.com/JacksCodeVault/gateway", "_blank")}
              >
                View on GitHub
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Open Source and Community Driven</h2>
            <p className="text-muted-foreground mb-8">
              Join our thriving community of developers. OpenSMS Gateway is free, open source, and welcomes contributions from developers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" onClick={() => window.open("https://github.com/JacksCodeVault/gateway", "_blank")}>
                Contribute on GitHub
              </Button>
              <Button variant="secondary">Join Discord Community</Button>
            </div>
          </motion.div>
        </section>

        <section className="py-12 md:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border bg-card p-6 md:p-8"
            >
              <MessageSquare className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">Reliable Messaging</h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                Ensure your messages are delivered with our robust infrastructure and fallback mechanisms.
              </p>
            </motion.div>
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-lg border bg-card p-6 md:p-8"
            >
              <Shield className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">Secure by Default</h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                Enterprise-grade security with end-to-end encryption and advanced access controls.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border bg-card p-6 md:p-8"
            >
              <Zap className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">Lightning Fast</h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                High-performance architecture designed for speed and scalability.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Why Choose OpenSMS Gateway?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border p-6"
            >
              <h3 className="text-xl font-semibold mb-2">100% Open Source</h3>
              <p className="text-muted-foreground">Free to use, modify, and distribute under MIT license. Full transparency and community-driven development.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border p-6"
            >
              <h3 className="text-xl font-semibold mb-2">Self-Hosted</h3>
              <p className="text-muted-foreground">Keep full control of your data by hosting on your own infrastructure. No vendor lock-in.</p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}