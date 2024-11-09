import { Github, Twitter, Book, FileText, MessageSquare, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-3">
            <h3 className="font-semibold">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Features</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Changelog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Roadmap</a></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">API Reference</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Guides</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Examples</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Discord</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">GitHub</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Twitter</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">License</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-12 pt-8 border-t space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Book className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm leading-loose">
              Built with <Heart className="inline-block h-4 w-4 text-red-500" /> by{" "}
              <a
                href="https://github.com/JacksCodeVault/"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Jack
              </a>
              . The source code is available on{" "}
              <a
                href="https://github.com/JacksCodeVault/gateway"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
