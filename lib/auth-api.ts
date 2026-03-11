import axios, { AxiosError } from "axios"

// =============================================================
// Auth API Service con AXIOS y Cookies (HttpOnly)
// =============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// 1. CREAMOS LA INSTANCIA DE AXIOS (El nuevo motor de peticiones)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000, // 2 minutos de espera máxima
  withCredentials: true, // ¡LA MAGIA! Esto obliga al navegador a enviar y recibir cookies seguras
  headers: {
    "Content-Type": "application/json",
  },
})

// ---------- Types ----------

export interface LoginRequest {
  email: string
  password: string
  mfa_code?: string
}

// 2. ACTUALIZAMOS EL RESPONSE: El backend ya no manda el token aquí
export interface LoginResponse {
  message: string
  user_name: string
}

export interface Career {
  career_id: number
  career_name: string
}

export interface RegisterRequest {
  career_id: number
  email: string
  first_name: string
  last_name: string
  matricula: string
  password: string
  preferences: {
    hobbies: string[]
    horario_preferido: string
  }
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  new_password: string
  token: string
}

export interface ApiValidationError {
  detail: {
    loc: (string | number)[]
    msg: string
    type: string
    input: string
    ctx: Record<string, unknown>
  }[]
}

export interface ApiError {
  status: number
  message: string
  detail?: ApiValidationError["detail"]
}

// ---------- Centralización de Errores ----------

function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 0
    const detail = error.response?.data?.detail

    throw {
      status,
      message:
        status === 0
          ? "No fue posible conectar con el servidor. Verifica tu conexion e intenta nuevamente."
          : status === 400
            ? "Peticion incorrecta o regla de negocio no cumplida."
            : status === 401
              ? "Credenciales incorrectas, código MFA inválido o sesión expirada."
              : status === 403
                ? "Cuenta bloqueada temporalmente por demasiados intentos."
                : status === 404
                  ? "Recurso o usuario no encontrado."
                  : status === 422
                    ? "Error de validación de datos."
                    : "Error interno del servidor.",
      detail,
    } as ApiError
  }
  
  // Si no es un error de Axios (ej. un error de sintaxis en el código), lo lanzamos crudo
  throw error
}

// ---------- Endpoints ----------

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", data)
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export async function logoutApi(): Promise<void> {
  try {
    await apiClient.post("/auth/logout")
  } catch (error) {
    handleAxiosError(error)
  }
}

export async function register(data: RegisterRequest): Promise<string> {
  try {
    const response = await apiClient.post<string>("/auth/register", data)
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<string> {
  try {
    const response = await apiClient.post<string>("/auth/forgot-password", data)
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export async function resetPassword(data: ResetPasswordRequest): Promise<string> {
  try {
    const response = await apiClient.post<string>("/auth/reset-password", data)
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export async function mfaSetup(userId: string): Promise<string> {
  try {
    const response = await apiClient.post<string>(`/auth/mfa/setup?user_id=${userId}`)
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export async function mfaVerify(userId: string, code: string): Promise<string> {
  try {
    const response = await apiClient.post<string>(`/auth/mfa/verify?user_id=${userId}&code=${code}`)
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export async function getCareers(): Promise<Career[]> {
  try {
    const response = await apiClient.get<Career[]>("/auth/careers")
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}