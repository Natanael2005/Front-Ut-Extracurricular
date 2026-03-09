import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { AuthProvider } from "@/context/auth-context"
import './globals.css'

// Configuramos las fuentes
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
  themeColor: '#000000', // Actualizado a negro puro
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      {/* Cambiamos bg-background por bg-black para asegurar un fondo negro puro */}
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        
        {/* Envolvemos nuestra aplicación con el estado global de autenticación */}
        <AuthProvider>
          {children}
        </AuthProvider>
        
      </body>
    </html>
  )
}