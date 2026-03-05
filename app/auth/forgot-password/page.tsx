"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
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
      // La API siempre devuelve exito (anti-enumeracion)
      // Pero manejamos errores de red o validacion
      setError(apiError.message || "Error al enviar la solicitud.")
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        description="Hemos enviado las instrucciones para restablecer tu contrasena."
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Si el correo <span className="font-medium text-foreground">{email}</span> esta
              registrado, recibiras un enlace para restablecer tu contrasena.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              El enlace expira en 15 minutos y es de un solo uso.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button variant="outline" className="border-border text-foreground bg-transparent" asChild>
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio de sesion
              </Link>
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Recuperar contrasena"
      description="Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

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

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {isLoading ? "Enviando..." : "Enviar enlace de recuperacion"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al inicio de sesion
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
