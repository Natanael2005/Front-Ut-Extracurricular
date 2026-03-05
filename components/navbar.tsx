"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Bot } from "lucide-react"

// Enlaces de navegación principal
const navLinks = [
  { label: "Producto", href: "#features" },
  { label: "Como funciona", href: "#como-funciona" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/100 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center px-5">

        {/* Grupo izquierdo: logo + navegación */}
        <div className="flex items-center gap-10">
          <a href="#" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">NexaBot</span>
          </a>

          <nav className="hidden items-center gap-4 md:flex">
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
        </div>

        {/* Botones derecha */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href="/auth/login">Iniciar sesion</a>
          </Button>

          <Button
            size="sm"
            className="px-2 bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <a href="/auth/register">Registrarse</a>
          </Button>
        </div>

        {/* Botón menú móvil */}
        <button
          type="button"
          className="ml-auto text-foreground md:hidden"
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
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-muted-foreground"
                asChild
              >
                <a href="/auth/login">Iniciar sesion</a>
              </Button>

              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                asChild
              >
                <a href="/auth/register">Registrarse</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}