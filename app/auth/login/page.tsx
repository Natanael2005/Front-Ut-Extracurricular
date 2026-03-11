"use client"

import React from "react"
import Link from "next/link"
import { motion, Variants } from "framer-motion"

// Componentes UI
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Shield, Loader2, Mail, Lock } from "lucide-react"

// Importamos nuestro nuevo super-hook
import { useLogin } from "@/hooks/use-login"

// Variantes de animación
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function LoginPage() {
  // 1. Inyectamos toda la lógica con una sola línea
  const {
    email, setEmail,
    password, setPassword,
    mfaCode, setMfaCode,
    showPassword, setShowPassword,
    showMfa,
    isLoading,
    error,
    handleSubmit
  } = useLogin()

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      description="Ingresa tus credenciales para acceder a tu cuenta."
      view="login"
    >
      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit} 
        className="flex flex-col gap-5"
      >
        
        {/* Mensaje de Error Animado */}
        {error && (
          <motion.div 
            variants={itemVariants}
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}

        {/* Input de Correo */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1.5 relative">
          <Label htmlFor="email" className="text-foreground text-[10px] font-semibold uppercase tracking-wider">
            Correo electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="tu.matricula@utcancun.edu.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-9 bg-secondary/30 border-border text-foreground rounded-xl focus:ring-primary/20"
            />
          </div>
        </motion.div>

        {/* Input de Contraseña */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1.5 relative">
          <div className="flex justify-between items-end">
            <Label htmlFor="password" className="text-foreground text-[10px] font-semibold uppercase tracking-wider">
              Contraseña
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-[10px] text-primary hover:text-primary/80 transition-colors font-medium uppercase tracking-wider"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-9 pr-10 bg-secondary/30 border-border text-foreground rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        {/* Bloque MFA con animación de altura */}
        {showMfa && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-1.5 p-4 rounded-xl border border-primary/20 bg-primary/5"
          >
            <Label htmlFor="mfa_code" className="text-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Código MFA
            </Label>
            <Input
              id="mfa_code"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
              required
              className="bg-background/50 border-primary/30 text-center tracking-[0.5em] text-lg font-mono rounded-xl h-12"
            />
          </motion.div>
        )}

        {/* Botón de Submit con Micro-interacciones */}
        <motion.div variants={itemVariants} className="mt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="relative w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium shadow-lg shadow-primary/20 overflow-hidden"
          >
            <motion.div
              className="flex items-center justify-center w-full h-full"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Iniciar sesión"
              )}
            </motion.div>
          </Button>
        </motion.div>

      </motion.form>
    </AuthLayout>
  )
}