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

            // NUEVA LÓGICA: Si la API responde con 202 (MFA Requerido)
            if (data.mfa_required) {
                setShowMfa(true)
                return // Pausamos la función aquí para que el usuario ingrese el código.
            }

            // Si llegamos aquí, es un 200 OK (Login exitoso)
            if (data.user_name) {
                login(data.user_name)
                router.push("/chat")
            }

        } catch (err) {
            const apiError = err as ApiError

            // El 401 ahora solo aparece si se equivocan de contraseña o de código MFA
            if (apiError.status === 401) {
                setError(showMfa ? "Código MFA inválido. Intenta de nuevo." : "Credenciales incorrectas.")
            } else {
                // Para 400, 403, 404, 422 y 500 usamos los mensajes que configuramos en auth-api.ts
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