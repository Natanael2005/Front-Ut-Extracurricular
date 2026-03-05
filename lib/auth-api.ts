// =============================================================
// Auth API Service — preparado para conectarse a la API externa
// Reemplaza API_BASE_URL con la URL real de tu backend
// =============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ---------- Types ----------

export interface LoginRequest {
  email: string
  password: string
  mfa_code?: string
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

export interface MfaSetupRequest {
  user_id: string
}

export interface MfaVerifyRequest {
  user_id: string
  code: string
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

// ---------- Helper ----------

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const apiError: ApiError = {
      status: response.status,
      message:
        response.status === 400
          ? "Peticion incorrecta o regla de negocio no cumplida."
          : response.status === 401
            ? "Credenciales incorrectas, codigo MFA invalido o codigo MFA faltante."
            : response.status === 403
              ? "Cuenta bloqueada temporalmente por demasiados intentos (Fuerza Bruta)."
              : response.status === 404
                ? "Recurso o usuario no encontrado."
                : response.status === 422
                  ? "Error de validacion."
                  : "Error interno del servidor.",
      detail: errorData?.detail,
    }
    throw apiError
  }
  return response.json() as Promise<T>
}

// ---------- Endpoints ----------

export async function login(data: LoginRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<string>(response)
}

export async function register(data: RegisterRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<string>(response)
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<string>(response)
}

export async function resetPassword(data: ResetPasswordRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<string>(response)
}

export async function mfaSetup(userId: string): Promise<string> {
  const params = new URLSearchParams({ user_id: userId })
  const response = await fetch(`${API_BASE_URL}/auth/mfa/setup?${params}`, {
    method: "POST",
  })
  return handleResponse<string>(response)
}

export async function mfaVerify(userId: string, code: string): Promise<string> {
  const params = new URLSearchParams({ user_id: userId, code })
  const response = await fetch(`${API_BASE_URL}/auth/mfa/verify?${params}`, {
    method: "POST",
  })
  return handleResponse<string>(response)
}
