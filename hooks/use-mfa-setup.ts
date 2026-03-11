import { useState } from "react"
import { useRouter } from "next/navigation"
import { mfaSetup, mfaVerify, type ApiError } from "@/lib/auth-api"

export type Step = "generate" | "scan" | "verify" | "success"

export function useMfaSetup() {
  const router = useRouter()
  
  // ================= ESTADOS =================
  const [step, setStep] = useState<Step>("generate")
  const [userId, setUserId] = useState("")
  const [mfaUri, setMfaUri] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // ================= FUNCIONES =================
  // Paso 1: Generar el QR
  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const uri = await mfaSetup(userId)
      setMfaUri(uri)
      setStep("scan")
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || "Error al generar el código QR.")
    } finally {
      setIsLoading(false)
    }
  }

  // Paso 2: Verificar el código
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await mfaVerify(userId, code)
      setStep("success")
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || "Código inválido. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Paso 3: Copiar la URI al portapapeles
  const copyUri = async () => {
    try {
      await navigator.clipboard.writeText(mfaUri)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback silencioso
    }
  }

  // ================= EXPORTACIÓN =================
  return {
    step, setStep,
    userId, setUserId,
    mfaUri,
    code, setCode,
    isLoading,
    error,
    copied,
    router,
    handleGenerateQR,
    handleVerify,
    copyUri
  }
}