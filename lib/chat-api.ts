import { apiClient } from "./auth-api"

export interface ChatResponse {
  pregunta: string
  respuesta: string
}

export async function askChatbot(question: string): Promise<ChatResponse> {
  // Como el apiClient ya tiene la URL del Gateway configurada,
  // solo necesitamos pasarle la ruta relativa "/chat/ask"
  const response = await apiClient.post<ChatResponse>(
    "/chat/ask", 
    { pregunta: question }
  )
  
  return response.data
}