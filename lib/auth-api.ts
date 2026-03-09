// =============================================================
// Auth API Service — preparado para conectarse a la API externa
// Reemplaza API_BASE_URL con la URL real de tu backend
// =============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const REQUEST_TIMEOUT_MS = 10_000

// ---------- Types ----------

export interface LoginRequest {
  email: string
  password: string
  mfa_code?: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
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

interface RequestConfig extends RequestInit {
  timeoutMs?: number
}

function createApiError(status: number, detail?: ApiValidationError["detail"]): ApiError {
  return {
    status,
    message:
      status === 0
        ? "No fue posible conectar con el servidor. Verifica tu conexion e intenta nuevamente."
        : status === 400
          ? "Peticion incorrecta o regla de negocio no cumplida."
          : status === 401
            ? "Credenciales incorrectas, codigo MFA invalido o codigo MFA faltante."
            : status === 403
              ? "Cuenta bloqueada temporalmente por demasiados intentos (Fuerza Bruta)."
              : status === 404
                ? "Recurso o usuario no encontrado."
                : status === 422
                  ? "Error de validacion."
                  : "Error interno del servidor.",
    detail,
  }
}

// ---------- Helper ----------

async function request<T>(endpoint: string, config: RequestConfig): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs ?? REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw createApiError(response.status, errorData?.detail)
    }

    return response.json() as Promise<T>
  } catch (error) {
    if ((error as DOMException).name === "AbortError") {
      throw {
        status: 0,
        message: "La solicitud tardo demasiado tiempo. Intenta nuevamente.",
      } as ApiError
    }

    if ((error as TypeError).name === "TypeError") {
      throw createApiError(0)
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

// ---------- Endpoints ----------

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function register(data: RegisterRequest): Promise<string> {
  return request<string>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<string> {
  return request<string>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function resetPassword(data: ResetPasswordRequest): Promise<string> {
  return request<string>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function mfaSetup(userId: string): Promise<string> {
  const params = new URLSearchParams({ user_id: userId })
  return request<string>(`/auth/mfa/setup?${params}`, {
    method: "POST",
    headers: {},
  })
}

export async function mfaVerify(userId: string, code: string): Promise<string> {
  const params = new URLSearchParams({ user_id: userId, code })
  return request<string>(`/auth/mfa/verify?${params}`, {
    method: "POST",
    headers: {},
  })
}

export async function getCareers(): Promise<Career[]> {
  return request<Career[]>("/auth/careers", {
    method: "GET",
  })
}
