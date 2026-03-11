import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { register, getCareers, type Career, type ApiError } from "@/lib/auth-api"

// Función validadora extraída del componente
function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  }
  const passed = Object.values(checks).filter(Boolean).length
  return { checks, passed }
}

export function useRegister() {
  const router = useRouter()
  
  // ================= ESTADOS =================
  const [formData, setFormData] = useState({
    career_id: "",
    email: "",
    first_name: "",
    last_name: "",
    matricula: "",
    password: "",
  })
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [horario, setHorario] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [careers, setCareers] = useState<Career[]>([])
  const [isLoadingCareers, setIsLoadingCareers] = useState(true)

  // ================= DERIVADOS =================
  const { checks, passed } = getPasswordStrength(formData.password)

  // ================= EFECTOS =================
  useEffect(() => {
    async function loadCareers() {
      try {
        const data = await getCareers()
        setCareers(data)
      } catch (err) {
        console.error("Error al cargar las carreras:", err)
        setError("No se pudieron cargar las carreras disponibles. Por favor recarga la página.")
      } finally {
        setIsLoadingCareers(false)
      }
    }
    loadCareers()
  }, [])

  // ================= FUNCIONES =================
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    )
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!formData.career_id) {
      setError("Por favor, selecciona una carrera.")
      return
    }

    if (passed < 4) {
      setError("La contraseña no cumple con los requisitos de seguridad.")
      return
    }

    setIsLoading(true)

    try {
      await register({
        career_id: Number(formData.career_id),
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        matricula: formData.matricula,
        password: formData.password,
        preferences: {
          hobbies: selectedHobbies,
          horario_preferido: horario,
        },
      })
      router.push("/auth/login")
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || "Error al registrar la cuenta.")
    } finally {
      setIsLoading(false)
    }
  }

  // ================= EXPORTACIÓN =================
  return {
    formData,
    selectedHobbies,
    horario, setHorario,
    showPassword, setShowPassword,
    isLoading,
    error,
    careers,
    isLoadingCareers,
    checks,
    passed,
    handleChange,
    toggleHobby,
    handleSubmit
  }
}