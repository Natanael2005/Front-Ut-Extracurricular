"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Importamos el layout maestro
import { AuthLayout } from "@/components/auth-layout" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Check, 
  X, 
  User, 
  Mail, 
  Hash, 
  BookOpen, 
  Clock,
  Lock
} from "lucide-react"

import { register, getCareers, type Career, type ApiError } from "@/lib/auth-api"

const HOBBIES_OPTIONS = [
  "Programar", "Leer", "Deportes", "Musica", 
  "Gaming", "Dibujo", "Cocina", "Fotografia",
]

const HORARIOS = ["Matutino", "Vespertino", "Mixto"]

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

export default function RegisterPage() {
  const router = useRouter()
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

  const { checks, passed } = getPasswordStrength(formData.password)

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <AuthLayout
      title="Crear cuenta"
      description="Regístrate como estudiante para acceder a todas las funcionalidades."
      view="register"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Mensaje de error */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Nombres y Apellidos en dos columnas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 relative">
            <Label htmlFor="first_name" className="text-foreground text-[10px] font-semibold uppercase tracking-wider">Nombre</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="first_name"
                placeholder="Nombres"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                required
                className="pl-9 bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground/60 rounded-xl"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 relative">
            <Label htmlFor="last_name" className="text-foreground text-[10px] font-semibold uppercase tracking-wider">Apellidos</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="last_name"
                placeholder="Apellidos"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                required
                className="pl-9 bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground/60 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Correo */}
        <div className="flex flex-col gap-1.5 relative">
          <Label htmlFor="email" className="text-foreground text-[10px] font-semibold uppercase tracking-wider">Correo institucional</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="matricula@utcancun.edu.mx"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="pl-9 bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground/60 rounded-xl"
            />
          </div>
        </div>

        {/* Matrícula y Horario en dos columnas para ahorrar espacio vertical */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 relative">
            <Label htmlFor="matricula" className="text-foreground text-[10px] font-semibold uppercase tracking-wider">Matrícula</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="matricula"
                placeholder="ej. 23393190"
                value={formData.matricula}
                onChange={(e) => handleChange("matricula", e.target.value)}
                required
                className="pl-9 bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground/60 rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <Label className="text-foreground text-[10px] font-semibold uppercase tracking-wider">Horario</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger className="pl-9 bg-secondary/30 border-border text-foreground rounded-xl">
                  <SelectValue placeholder="Turno" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {HORARIOS.map((h) => (
                    <SelectItem key={h} value={h} className="text-foreground">{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Carrera */}
        <div className="flex flex-col gap-1.5 relative">
          <Label className="text-foreground text-[10px] font-semibold uppercase tracking-wider">Carrera</Label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Select
              value={formData.career_id}
              onValueChange={(v) => handleChange("career_id", v)}
              disabled={isLoadingCareers}
            >
              <SelectTrigger className="pl-9 bg-secondary/30 border-border text-foreground rounded-xl">
                <SelectValue placeholder={isLoadingCareers ? "Cargando..." : "Selecciona tu carrera"} />
              </SelectTrigger>
              <SelectContent position="popper" avoidCollisions={false} className="bg-card border-border w-[var(--radix-select-trigger-width)] max-h-[300px]">
                {careers.map((c) => (
                  <SelectItem
                    key={c.career_id}
                    value={String(c.career_id)}
                    className="text-foreground whitespace-normal py-2 pr-2"
                  >
                    {c.career_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-1.5 relative">
          <Label htmlFor="reg_password" className="text-foreground text-[10px] font-semibold uppercase tracking-wider">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="reg_password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 12 caracteres"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              className="pl-9 pr-10 bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground/60 rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Barras de seguridad y condiciones */}
          {formData.password && (
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors ${i <= passed ? (passed <= 2 ? "bg-destructive" : passed === 3 ? "bg-yellow-500" : "bg-primary") : "bg-muted"}`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">
                {[
                  { key: "length", label: "Mín. 12 caracteres" },
                  { key: "uppercase", label: "Una mayúscula" },
                  { key: "number", label: "Un número" },
                  { key: "special", label: "Un carácter especial" },
                ].map((rule) => (
                  <span
                    key={rule.key}
                    className={`flex items-center gap-1 ${checks[rule.key as keyof typeof checks] ? "text-primary font-medium" : "text-muted-foreground"}`}
                  >
                    {checks[rule.key as keyof typeof checks] ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {rule.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hobbies - Ocultos detrás de un toggle visual pequeño para ahorrar espacio, o mostrados de forma compacta */}
        <div className="flex flex-col gap-1.5 mt-1">
          <Label className="text-foreground text-[10px] font-semibold uppercase tracking-wider">Intereses / Hobbies</Label>
          <div className="flex flex-wrap gap-1.5">
            {HOBBIES_OPTIONS.map((hobby) => {
              const selected = selectedHobbies.includes(hobby)
              return (
                <button
                  key={hobby}
                  type="button"
                  onClick={() => toggleHobby(hobby)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all ${selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                    }`}
                >
                  {hobby}
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-xl font-medium shadow-lg shadow-primary/20"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Registrando..." : "Crear cuenta"}
        </Button>
      </form>
    </AuthLayout>
  )
}