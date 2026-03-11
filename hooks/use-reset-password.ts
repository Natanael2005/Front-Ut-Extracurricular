import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { resetPassword, type ApiError } from "@/lib/auth-api"

// Función validadora
export function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  }
  const passed = Object.values(checks).filter(Boolean).length
  return { checks, passed }
}

export function useResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  // ================= ESTADOS =================
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // ================= DERIVADOS =================
  const { checks, passed } = getPasswordStrength(newPassword)

  // ================= FUNCIONES =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (passed < 4) {
      setError("La contraseña no cumple con los requisitos de seguridad.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (!token) return

    setIsLoading(true)

    try {
      await resetPassword({ new_password: newPassword, token })
      setSuccess(true)
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.status === 400) {
        setError("El token ha expirado o ya fue utilizado. Solicita uno nuevo.")
      } else {
        setError(apiError.message || "Error al restablecer la contraseña.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ================= EXPORTACIÓN =================
  return {
    token,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirm, setShowConfirm,
    isLoading,
    error,
    success,
    checks,
    passed,
    handleSubmit
  }
}