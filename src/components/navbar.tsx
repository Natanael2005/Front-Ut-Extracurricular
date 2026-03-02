import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, X, Bot } from "lucide-react"



const navLinks = [
  { label: "Producto", href: "#features" },
  { label: "Como funciona", href: "#como-funciona" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b  bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between px-7 ">
        <a href="#" className="flex items-center gap-2">
          <img
            src="/logo-ut-bis.png"
            alt="Logo UT Cancún BIS"
            className="h-9 max-w-[140px] w-auto object-contain"
          />
          <span className="text-lg font-bold text-foreground">Teko</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex md:absolute md:left-1/2 md:-translate-x-1/2 md:z-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Iniciar sesion
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link to="/chat">Probar ahora</Link>
          </Button>
        </div>

        <button
          type="button"
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" size="sm" className="justify-start text-muted-foreground">
                Iniciar sesion
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground" asChild>
                <Link to="/chat">Probar ahora</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
