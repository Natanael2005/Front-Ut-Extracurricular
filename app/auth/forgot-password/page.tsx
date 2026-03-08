"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail } from "lucide-react" 
import { forgotPassword, type ApiError } from "@/lib/auth-api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await forgotPassword({ email })
      setSent(true)
    } catch (err) {
      const apiError = err as ApiError
      // La API siempre devuelve éxito (anti-enumeración)
      // Pero manejamos errores de red o validación
      setError(apiError.message || "Error al enviar la solicitud.")
    } finally {
      setIsLoading(false)
    }
  }

  // Vista de éxito (Correo enviado) - Estilo limpio sin íconos
  if (sent) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        description="Hemos enviado las instrucciones para restablecer tu contraseña."
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 text-center">
            <p className="text-sm text-foreground">
              Si el correo <span className="font-bold text-primary">{email}</span> está registrado, recibirás un enlace.
            </p>
          </div>
          
          <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-2">
            El enlace expira en 15 minutos y es de un solo uso.
          </p>

          <Button 
            className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-xl font-medium shadow-lg shadow-primary/20" 
            asChild
          >
            <Link href="/auth/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  // Vista principal (Formulario)
  return (
    <AuthLayout
      title="Recuperar contraseña"
      description="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Input con ícono de correo regresado */}
        <div className="flex flex-col gap-1.5 relative">
          <Label htmlFor="email" className="text-foreground text-[10px] font-semibold uppercase tracking-wider">
            Correo electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="matricula@utcancun.edu.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-9 bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground/60 rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-xl font-medium shadow-lg shadow-primary/20"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-2">
            ¿Recordaste tu contraseña?{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}