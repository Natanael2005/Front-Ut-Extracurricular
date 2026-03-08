"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, Variants } from "framer-motion" // Importamos motion
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail } from "lucide-react" 
import { forgotPassword, type ApiError } from "@/lib/auth-api"

// --- CONFIGURACIÓN DE ANIMACIONES (Sin errores de tipos) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1] // Curva de seda optimizada
    }
  }
}

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
      setError(apiError.message || "Error al enviar la solicitud.")
    } finally {
      setIsLoading(false)
    }
  }

  // Vista de éxito (Correo enviado)
  if (sent) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        description="Hemos enviado las instrucciones para restablecer tu contraseña."
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 py-2"
        >
          <motion.div 
            variants={itemVariants}
            className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 text-center"
          >
            <p className="text-sm text-foreground">
              Si el correo <span className="font-bold text-primary">{email}</span> está registrado, recibirás un enlace.
            </p>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-2"
          >
            El enlace expira en 15 minutos y es de un solo uso.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button 
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-xl font-medium shadow-lg shadow-primary/20" 
              asChild
            >
              <Link href="/auth/login">Volver al inicio de sesión</Link>
            </Button>
          </motion.div>
        </motion.div>
      </AuthLayout>
    )
  }

  // Vista principal (Formulario)
  return (
    <AuthLayout
      title="Recuperar contraseña"
      description="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
    >
      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit} 
        className="flex flex-col gap-5"
      >
        {error && (
          <motion.div 
            variants={itemVariants}
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5 relative">
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
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2 mt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-xl font-medium shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
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
        </motion.div>
      </motion.form>
    </AuthLayout>
  )
}