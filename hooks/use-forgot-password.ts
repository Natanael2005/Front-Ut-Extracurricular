import { useState } from "react"
import { forgotPassword, type ApiError } from "@/lib/auth-api"

export function useForgotPassword() {
  // ================= ESTADOS =================
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false) // Controla si mostramos el mensaje de éxito

  // ================= FUNCIONES =================
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await forgotPassword({ email })
      setSent(true) // Si todo sale bien, cambiamos a la vista de éxito
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || "Error al enviar la solicitud.")
    } finally {
      setIsLoading(false)
    }
  }

  // ================= EXPORTACIÓN =================
  return {
    email, setEmail,
    isLoading,
    error,
    sent,
    handleSubmit
  }
}