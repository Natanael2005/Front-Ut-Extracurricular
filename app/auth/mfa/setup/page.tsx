"use client"

import React from "react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2, QrCode, ArrowRight, Smartphone, Copy, CheckCircle2 } from "lucide-react"

// Importamos nuestro nuevo super-hook
import { useMfaSetup } from "@/hooks/use-mfa-setup"

export default function MfaSetupPage() {
  // 1. Inyectamos la lógica limpiamente
  const {
    step, setStep,
    userId, setUserId,
    mfaUri,
    code, setCode,
    isLoading,
    error,
    copied,
    router,
    handleGenerateQR,
    handleVerify,
    copyUri
  } = useMfaSetup()

  // --- Step: Generate ---
  if (step === "generate") {
    return (
      <AuthLayout
        title="Configurar autenticación MFA"
        description="Protege tu cuenta con verificación en dos pasos usando Google Authenticator."
      >
        <form onSubmit={handleGenerateQR} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
              1
            </span>
            <div className="h-px w-8 bg-border" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
              2
            </span>
            <div className="h-px w-8 bg-border" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
              3
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Primero, necesitamos tu ID de usuario para generar el código QR de configuración.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="user_id" className="text-foreground">
              ID de usuario
            </Label>
            <Input
              id="user_id"
              placeholder="Ingresa tu ID de usuario"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
              <QrCode className="h-4 w-4" />
            )}
            {isLoading ? "Generando..." : "Generar código QR"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Volver al inicio de sesión
            </Link>
          </p>
        </form>
      </AuthLayout>
    )
  }

  // --- Step: Scan QR ---
  if (step === "scan") {
    return (
      <AuthLayout
        title="Escanea el código QR"
        description="Abre Google Authenticator y escanea el siguiente código."
      >
        <div className="flex flex-col gap-5">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary font-medium">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="h-px w-8 bg-primary" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
              2
            </span>
            <div className="h-px w-8 bg-border" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
              3
            </span>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <QRCodeSVG
                value={mfaUri}
                size={200}
                bgColor="hsl(0, 0%, 100%)"
                fgColor="hsl(0, 0%, 4%)"
                level="M"
              />
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Escanea con Google Authenticator
              </p>
            </div>
          </div>

          {/* Manual entry */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              Si no puedes escanear, copia esta URI:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground font-mono">
                {mfaUri}
              </code>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyUri}
                className="shrink-0 border-border bg-transparent text-foreground"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            onClick={() => setStep("verify")}
            className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Ya lo escaneé
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </AuthLayout>
    )
  }

  // --- Step: Verify ---
  if (step === "verify") {
    return (
      <AuthLayout
        title="Verificar configuración"
        description="Ingresa el código de 6 dígitos que muestra tu aplicación de autenticación."
      >
        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary font-medium">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="h-px w-8 bg-primary" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary font-medium">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="h-px w-8 bg-primary" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
              3
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mfa_code" className="text-foreground">
              Código de verificación
            </Label>
            <Input
              id="mfa_code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground tracking-[0.5em] text-center text-2xl font-mono"
            />
            <p className="text-xs text-muted-foreground">
              El código se actualiza cada 30 segundos.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            {isLoading ? "Verificando..." : "Activar MFA"}
          </Button>

          <button
            type="button"
            onClick={() => setStep("scan")}
            className="text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Volver a ver el código QR
          </button>
        </form>
      </AuthLayout>
    )
  }

  // --- Step: Success ---
  return (
    <AuthLayout
      title="MFA activado"
      description="La autenticación de dos factores ha sido configurada exitosamente."
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            A partir de ahora, necesitarás ingresar un código de verificación cada vez que inicies sesión.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            El MFA queda activo permanentemente en tu cuenta.
          </p>
        </div>
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => router.push("/auth/login")}
        >
          Ir a iniciar sesión
        </Button>
      </div>
    </AuthLayout>
  )
}