"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Eye, EyeOff, UserPlus, Loader2, Check, X } from "lucide-react"
import { register, type ApiError } from "@/lib/auth-api"

// Catalogo de carreras — reemplazar con datos del backend
const CARRERAS = [
  { id: 1, name: "Ingenieria en Desarrollo de Software" },
  { id: 2, name: "Ingenieria en Tecnologias de la Informacion" },
  { id: 3, name: "Ingenieria en Mecatronica" },
  { id: 4, name: "Licenciatura en Administracion" },
  { id: 5, name: "Licenciatura en Contaduria" },
  { id: 6, name: "Ingenieria en Energias Renovables" },
]

const HOBBIES_OPTIONS = [
  "Programar",
  "Leer",
  "Deportes",
  "Musica",
  "Gaming",
  "Dibujo",
  "Cocina",
  "Fotografia",
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

  const { checks, passed } = getPasswordStrength(formData.password)

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

    if (passed < 4) {
      setError("La contrasena no cumple con los requisitos de seguridad.")
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
      description="Registrate como estudiante para acceder a todas las funcionalidades."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="first_name" className="text-foreground">
              Nombre
            </Label>
            <Input
              id="first_name"
              placeholder="Diego Angel"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              required
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="last_name" className="text-foreground">
              Apellidos
            </Label>
            <Input
              id="last_name"
              placeholder="Ramirez Fernandez"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              required
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-foreground">
            Correo institucional
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="23393190@utcancun.edu.mx"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">Debe ser un correo @utcancun.edu.mx</p>
        </div>

        {/* Matricula */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="matricula" className="text-foreground">
            Matricula
          </Label>
          <Input
            id="matricula"
            placeholder="23393190"
            value={formData.matricula}
            onChange={(e) => handleChange("matricula", e.target.value)}
            required
            className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Career */}
        <div className="flex flex-col gap-2">
          <Label className="text-foreground">Carrera</Label>
          <Select value={formData.career_id} onValueChange={(v) => handleChange("career_id", v)}>
            <SelectTrigger className="bg-secondary/50 border-border text-foreground">
              <SelectValue placeholder="Selecciona tu carrera" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {CARRERAS.map((c) => (
                <SelectItem key={c.id} value={String(c.id)} className="text-foreground">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reg_password" className="text-foreground">
            Contrasena
          </Label>
          <div className="relative">
            <Input
              id="reg_password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimo 12 caracteres"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {/* Password strength */}
          {formData.password && (
            <div className="mt-1 flex flex-col gap-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= passed
                        ? passed <= 2
                          ? "bg-destructive"
                          : passed === 3
                            ? "bg-yellow-500"
                            : "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                {[
                  { key: "length", label: "Min. 12 caracteres" },
                  { key: "uppercase", label: "Una mayuscula" },
                  { key: "number", label: "Un numero" },
                  { key: "special", label: "Un caracter especial (@$!%*?&)" },
                ].map((rule) => (
                  <span
                    key={rule.key}
                    className={`flex items-center gap-1 ${
                      checks[rule.key as keyof typeof checks] ? "text-primary" : "text-muted-foreground"
                    }`}
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

        {/* Hobbies */}
        <div className="flex flex-col gap-2">
          <Label className="text-foreground">Hobbies</Label>
          <div className="flex flex-wrap gap-2">
            {HOBBIES_OPTIONS.map((hobby) => {
              const selected = selectedHobbies.includes(hobby)
              return (
                <button
                  key={hobby}
                  type="button"
                  onClick={() => toggleHobby(hobby)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {hobby}
                </button>
              )
            })}
          </div>
        </div>

        {/* Horario */}
        <div className="flex flex-col gap-2">
          <Label className="text-foreground">Horario preferido</Label>
          <Select value={horario} onValueChange={setHorario}>
            <SelectTrigger className="bg-secondary/50 border-border text-foreground">
              <SelectValue placeholder="Selecciona tu horario" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {HORARIOS.map((h) => (
                <SelectItem key={h} value={h} className="text-foreground">
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {isLoading ? "Registrando..." : "Crear cuenta"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Inicia sesion
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
