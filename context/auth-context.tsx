"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient, logoutApi } from "@/lib/auth-api" // Importamos tu cliente Axios y la función de logout

interface AuthContextType {
  user_name: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userName: string) => void 
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user_name, setUserName] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 1. El "Guardia de Seguridad" al recargar la página
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Intentamos pedir un nuevo Access Token. 
        // Axios mandará la cookie Refresh automáticamente.
        await apiClient.post("/auth/refresh")
        
        // Si el servidor responde OK (200), ¡la sesión es válida!
        const storedName = localStorage.getItem("user_name")
        setIsAuthenticated(true)
        setUserName(storedName || "Usuario")
      } catch (error) {
        // Si falla (ej. el token expiró o borraron las cookies), limpiamos la interfaz
        localStorage.removeItem("user_name")
        setIsAuthenticated(false)
        setUserName(null)
      } finally {
        // Pase lo que pase, apagamos la pantalla de "Verificando credenciales..."
        setIsLoading(false)
      }
    }

    verifySession()
  }, [])

  // 2. Función para iniciar sesión visualmente
  const login = (userName: string) => {
    // Solo guardamos el nombre para mostrarlo en el Navbar.
    // El token ya está seguro en la bóveda de cookies del navegador.
    localStorage.setItem("user_name", userName)
    setIsAuthenticated(true)
    setUserName(userName)
  }

  // 3. Función para cerrar sesión de forma segura
  const logout = async () => {
    try {
      // Le ordenamos al servidor de Python que destruya las cookies
      await logoutApi() 
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor", error)
    } finally {
      // Limpiamos la memoria del frontend
      localStorage.removeItem("user_name")
      setIsAuthenticated(false)
      setUserName(null)
      router.push("/auth/login")
    }
  }

  return (
    <AuthContext.Provider value={{ user_name, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}