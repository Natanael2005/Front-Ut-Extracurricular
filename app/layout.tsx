import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { AuthProvider } from "@/context/auth-context"
import { NoiseBackground } from "@/components/ui/noisebackground"
import './globals.css'

// 1. Configuramos las fuentes para exportar sus variables CSS
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans' 
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'NexaBot - Asistente IA Conversacional',
  description: 'Potencia tu negocio con un chatbot inteligente. Respuestas instantaneas, soporte 24/7 y una experiencia conversacional unica.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // 2. Inyectamos las variables de las fuentes en la etiqueta html
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground relative">
        <NoiseBackground />
        
        {/* 3. Envolvemos nuestra aplicación con el estado global de autenticación */}
        <AuthProvider>
          <div className="relative z-10">
            {children}
          </div>
        </AuthProvider>
        
      </body>
    </html>
  )
}