"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, LogIn, Shield, Loader2 } from "lucide-react"
import { login, type ApiError } from "@/lib/auth-api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showMfa, setShowMfa] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const token = await login({
        email,
        password,
        ...(showMfa && mfaCode ? { mfa_code: mfaCode } : {}),
      })
      // Almacenar token y redirigir
      // localStorage.setItem("token", token) — descomentar cuando la API este lista
      void token
      router.push("/chat")
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.status === 401 && !showMfa) {
        // La API solicita el codigo MFA
        setShowMfa(true)
        setError("Se requiere el codigo de autenticacion MFA.")
      } else if (apiError.status === 403) {
        setError("Cuenta bloqueada temporalmente. Intenta de nuevo en 15 minutos.")
      } else {
        setError(apiError.message || "Error al iniciar sesion.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Iniciar sesion"
      description="Ingresa tus credenciales para acceder a tu cuenta."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-foreground">
            Correo electronico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu.matricula@utcancun.edu.mx"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-foreground">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-primary hover:text-primary/80 transition-colors self-end"
          >
            Olvidaste tu contraseña?
          </Link>
        </div>

        {/* MFA Code - visible only when API returns 401 */}
        {showMfa && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="mfa_code" className="text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Codigo MFA
            </Label>
            <Input
              id="mfa_code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Ingresa el codigo de 6 digitos"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
              required
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground tracking-widest text-center text-lg font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Ingresa el codigo de tu aplicacion de autenticacion (Google Authenticator).
            </p>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
        </Button>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground">
          No tienes cuenta?{" "}
          <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Registrate aqui
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
