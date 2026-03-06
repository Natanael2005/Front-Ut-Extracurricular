"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

// 1. Definimos qué datos y funciones estarán disponibles globalmente
interface AuthContextType {
  user_name: string | null
  isAuthenticated: boolean
  isLoading: boolean // Clave para evitar el parpadeo visual
  login: (token: string, userName: string) => void
  logout: () => void
}

// 2. Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 3. Creamos el Proveedor (El componente que envolverá tu app)
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user_name, setUserName] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Al inicializar la app, buscamos la sesión en el navegador
  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedName = localStorage.getItem("user_name")

    if (token) {
      setIsAuthenticated(true)
      setUserName(storedName || "Usuario")
    }
    
    // Una vez que terminamos de leer, apagamos el estado de carga
    setIsLoading(false)
  }, [])

  // Función global para iniciar sesión
  const login = (token: string, userName: string) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user_name", userName)
    setIsAuthenticated(true)
    setUserName(userName)
  }

  // Función global para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_name")
    setIsAuthenticated(false)
    setUserName(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user_name, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 4. Creamos el Hook personalizado para consumirlo fácilmente
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}