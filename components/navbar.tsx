"use client"

import { useState } from "react"
// Ya no necesitamos useEffect aquí
import { Button } from "@/components/ui/button"
import { Menu, X, Bot, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context" // 1. Importamos el contexto global

// Enlaces de navegación principal
const navLinks = [
  { label: "Producto", href: "#features" },
  { label: "Como funciona", href: "#como-funciona" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // 2. Extraemos todo el estado directamente de nuestro proveedor global
  const { user_name, isAuthenticated, isLoading, logout } = useAuth()

  const handleMobileLogout = () => {
    logout()
    setMobileOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/100 bg-card">
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

        {/* Botones derecha (Escritorio) */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          {/* 3. Lógica antimismtach: Si está cargando, no mostramos botones temporalmente */}
          {isLoading ? (
            <div className="w-40 h-8" /> // Espacio reservado para evitar que el diseño salte
          ) : isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground mr-2">
                Bienvenido, <span className="font-semibold text-foreground">{user_name || "Usuario"}</span>
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="px-2 text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href="/chat">Ir al Chat</a>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout} // Llamamos al logout global
                className="text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href="/auth/login">Iniciar sesion</a>
              </Button>
            </>
          )}
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

      {/* Menú móvil */}
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

            <div className="flex flex-col gap-2 pt-2 border-t border-border/50 mt-2">
              {isLoading ? (
                <div className="h-20" /> // Espacio de carga móvil
              ) : isAuthenticated ? (
                <>
                  {/* Restauré el mensaje de bienvenida que faltaba en tu versión móvil */}
                  <span className="text-sm text-muted-foreground py-2">
                    Bienvenido, <span className="font-semibold text-foreground">{user_name || "Usuario"}</span>
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <a href="/chat" onClick={() => setMobileOpen(false)}>Ir al Chat</a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMobileLogout} // Cierra sesión y contrae el menú
                    className="justify-start text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors mt-1"
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-muted-foreground"
                    asChild
                  >
                    <a href="/auth/login" onClick={() => setMobileOpen(false)}>Iniciar sesion</a>
                  </Button>

                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground"
                    asChild
                  >
                    <a href="/auth/register" onClick={() => setMobileOpen(false)}>Registrarse</a>
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