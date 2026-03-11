import { useState } from "react"
import { useRouter } from "next/navigation"
import { login as apiLogin, type ApiError } from "@/lib/auth-api" 
import { useAuth } from "@/context/auth-context" 

export function useLogin() {
  const router = useRouter()
  const { login } = useAuth() 

  // ================= ESTADOS =================
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showMfa, setShowMfa] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // ================= FUNCIONES =================
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const data = await apiLogin({
        email,
        password,
        ...(showMfa && mfaCode ? { mfa_code: mfaCode } : {}),
      })
      
      // Llamamos a la función global del Contexto (solo con el nombre, gracias a Axios)
      login(data.user_name) 
      router.push("/chat")
      
    } catch (err) {
      const apiError = err as ApiError
      
      // Lógica de validación de Errores (MFA, Bloqueos, etc.)
      if (apiError.status === 401 && !showMfa) {
        setShowMfa(true)
        setError("Se requiere el código de autenticación MFA.")
      } else if (apiError.status === 403) {
        setError("Cuenta bloqueada temporalmente. Intenta de nuevo en 1 minuto.")
      } else {
        setError(apiError.message || "Error al iniciar sesión.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ================= EXPORTACIÓN =================
  return {
    email, setEmail,
    password, setPassword,
    mfaCode, setMfaCode,
    showPassword, setShowPassword,
    showMfa,
    isLoading,
    error,
    handleSubmit
  }
}