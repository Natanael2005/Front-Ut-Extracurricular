"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Bot, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const navLinks = [
  { label: "Producto", href: "#features" },
  { label: "Como funciona", href: "#como-funciona" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user_name, isAuthenticated, isLoading, logout } = useAuth()

  const handleMobileLogout = () => {
    logout()
    setMobileOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/100 bg-card">
      <div className="flex h-16 w-full items-center px-5">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">NexaBot</span>
          </Link>

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

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {isLoading ? (
            <div className="h-8 w-40" />
          ) : isAuthenticated ? (
            <>
              <span className="mr-2 text-sm text-muted-foreground">
                Bienvenido, <span className="font-semibold text-foreground">{user_name || "Usuario"}</span>
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="px-2 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/chat">Ir al Chat</Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="px-2 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/auth/login">Iniciar sesion</Link>
            </Button>
          )}
        </div>

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

            <div className="mt-2 flex flex-col gap-2 border-t border-border/50 pt-2">
              {isLoading ? (
                <div className="h-20" />
              ) : isAuthenticated ? (
                <>
                  <span className="py-2 text-sm text-muted-foreground">
                    Bienvenido, <span className="font-semibold text-foreground">{user_name || "Usuario"}</span>
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <Link href="/chat" onClick={() => setMobileOpen(false)}>
                      Ir al Chat
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMobileLogout}
                    className="mt-1 justify-start text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="justify-start text-muted-foreground" asChild>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      Iniciar sesion
                    </Link>
                  </Button>

                  <Button size="sm" className="bg-primary text-primary-foreground" asChild>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      Registrarse
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
