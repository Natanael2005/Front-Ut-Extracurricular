"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Sparkles, Bot } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  view?: "login" | "register"
}

export function AuthLayout({ children, title, description, view }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden bg backg">
      

      {/* 2. TARJETA PRINCIPAL: Con animación de entrada y efecto de cristal */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0, 0, 0.58, 1] }}
        className="relative z-10 w-full max-w-5xl bg-zinc-950/40 backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 lg:grid lg:grid-cols-2"
      >
        
        {/* LADO IZQUIERDO: Contenedor del Formulario (Login/Registro) */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 relative z-10">
          <div className="mx-auto w-full max-w-md">
            
            {/* BOTÓN DE REGRESO A NEXABOT */}
            <Link 
              href="/" 
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors w-fit"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              Regresar a NexaBot
            </Link>

            {/* PÍLDORA DE NAVEGACIÓN (Solo aparece si se define 'view') */}
            {view && (
              <div className="flex p-1 mb-8 rounded-full bg-secondary/30 border border-white/5 backdrop-blur-md">
                {view === "login" ? (
                  <>
                    <div className="flex-1 text-center py-2 text-sm font-medium rounded-full bg-background/50 shadow-sm text-white">
                      Iniciar sesión
                    </div>
                    <Link href="/auth/register" className="flex-1 text-center py-2 text-sm font-medium rounded-full text-zinc-400 hover:text-white transition-colors">
                      Crear cuenta
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="flex-1 text-center py-2 text-sm font-medium rounded-full text-zinc-400 hover:text-white transition-colors">
                      Iniciar sesión
                    </Link>
                    <div className="flex-1 text-center py-2 text-sm font-medium rounded-full bg-background/50 shadow-sm text-white">
                      Crear cuenta
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ENCABEZADOS DINÁMICOS */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
              <p className="mt-2 text-sm text-zinc-400">{description}</p>
            </div>

            {/* INYECCIÓN DE FORMULARIOS (LOGIN O REGISTRO) */}
            {children}
          </div>
        </div>

        {/* LADO DERECHO: Panel Visual Estético con Blur selectivo */}
        <div className="hidden lg:flex relative items-center justify-center p-12 overflow-hidden bg-primary/5 border-l border-white/5">
          <div className="relative z-20 flex flex-col items-center text-center max-w-sm">
            
            {/* ÍCONO CON BRILLO SUTIL */}
            <div className="mb-8 p-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight drop-shadow-md">
              Diseña tu <br/> experiencia
            </h2>

            {/* CUADRO DE TEXTO CON BLUR REFORZADO */}
            <p className="text-zinc-300 text-sm leading-relaxed bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/5">
              Un entorno creado para estudiantes de la UT Cancún enfocado en llevar tus proyectos al siguiente nivel.
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  )
}