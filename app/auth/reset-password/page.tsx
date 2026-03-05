"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, KeyRound, Loader2, Check, X, CheckCircle2, AlertTriangle } from "lucide-react"
import { resetPassword, type ApiError } from "@/lib/auth-api"

function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  }
  const passed = Object.values(checks).filter(Boolean).length
  return { checks, passed }
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { checks, passed } = getPasswordStrength(newPassword)

  // Token no presente en la URL
  if (!token) {
    return (
      <AuthLayout
        title="Enlace invalido"
        description="El enlace de recuperacion no es valido o ha expirado."
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            El token de recuperacion no fue encontrado. Solicita un nuevo enlace de recuperacion.
          </p>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/auth/forgot-password">Solicitar nuevo enlace</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (success) {
    return (
      <AuthLayout
        title="Contrasena actualizada"
        description="Tu contrasena ha sido restablecida exitosamente."
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Ahora puedes iniciar sesion con tu nueva contrasena.
          </p>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/auth/login">Ir a iniciar sesion</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (passed < 4) {
      setError("La contrasena no cumple con los requisitos de seguridad.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contrasenas no coinciden.")
      return
    }

    setIsLoading(true)

    try {
      await resetPassword({ new_password: newPassword, token })
      setSuccess(true)
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.status === 400) {
        setError("El token ha expirado o ya fue utilizado. Solicita uno nuevo.")
      } else {
        setError(apiError.message || "Error al restablecer la contrasena.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Nueva contrasena"
      description="Establece tu nueva contrasena. Recuerda que el enlace expira en 15 minutos."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* New password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="new_password" className="text-foreground">
            Nueva contrasena
          </Label>
          <div className="relative">
            <Input
              id="new_password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimo 12 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar" : "Mostrar"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {/* Password strength */}
          {newPassword && (
            <div className="mt-1 flex flex-col gap-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= passed
                        ? passed <= 2
                          ? "bg-destructive"
                          : passed === 3
                            ? "bg-yellow-500"
                            : "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                {[
                  { key: "length", label: "Min. 12 caracteres" },
                  { key: "uppercase", label: "Una mayuscula" },
                  { key: "number", label: "Un numero" },
                  { key: "special", label: "Caracter especial (@$!%*?&)" },
                ].map((rule) => (
                  <span
                    key={rule.key}
                    className={`flex items-center gap-1 ${
                      checks[rule.key as keyof typeof checks] ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {checks[rule.key as keyof typeof checks] ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {rule.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm_password" className="text-foreground">
            Confirmar contrasena
          </Label>
          <div className="relative">
            <Input
              id="confirm_password"
              type={showConfirm ? "text" : "password"}
              placeholder="Repite la contrasena"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? "Ocultar" : "Mostrar"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <X className="h-3 w-3" />
              Las contrasenas no coinciden
            </p>
          )}
          {confirmPassword && newPassword === confirmPassword && confirmPassword.length > 0 && (
            <p className="text-xs text-primary flex items-center gap-1">
              <Check className="h-3 w-3" />
              Las contrasenas coinciden
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="h-4 w-4" />
          )}
          {isLoading ? "Restableciendo..." : "Restablecer contrasena"}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Cargando..." description="Validando enlace de recuperacion.">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AuthLayout>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
