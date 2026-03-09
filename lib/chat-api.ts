// lib/chat-api.ts

// 1. Importamos tu función inteligente que maneja errores y timeouts
import { request } from "./auth-api"

// 2. Definimos la URL exclusiva de este microservicio
const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL

export interface ChatResponse {
  pregunta: string
  respuesta: string
}

// 3. El endpoint limpio y aislado
export async function askChatbot(question: string, token: string): Promise<ChatResponse> {
  return request<ChatResponse>(`${CHATBOT_API_URL}/chat/ask`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`, 
    },
    body: JSON.stringify({ pregunta: question }), 
  })
}