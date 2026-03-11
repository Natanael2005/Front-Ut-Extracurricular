// lib/chat-api.ts
import { apiClient } from "./auth-api" // Importamos el motor de Axios

const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL

export interface ChatResponse {
  pregunta: string
  respuesta: string
}

// Ya NO pedimos el token aquí
export async function askChatbot(question: string): Promise<ChatResponse> {
  // apiClient insertará las cookies (HttpOnly) mágicamente en este viaje
  const response = await apiClient.post<ChatResponse>(
    `${CHATBOT_API_URL}/chat/ask`, 
    { pregunta: question }
  )
  
  return response.data
}