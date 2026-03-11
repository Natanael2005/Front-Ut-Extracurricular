import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { askChatbot } from "@/lib/chat-api"

// Exportamos la interfaz para que la página visual también pueda usarla
export interface Message {
  id: number
  role: "user" | "bot"
  text: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "¡Hola! Soy NexaBot, tu asistente virtual. Puedes preguntarme sobre los talleres extracurriculares o cualquier duda que tengas.",
  },
]

export function useChat() {
  const { logout } = useAuth() // Traemos el logout por si el token expira (Error 401)
  
  // ================= ESTADOS =================
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  
  // ================= REFERENCIAS =================
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // ================= EFECTOS =================
  // Auto-scroll hacia abajo cada vez que hay un nuevo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // ================= FUNCIONES =================
  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    // 1. Mensaje del usuario
    const userMessage: Message = { id: Date.now(), role: "user", text: messageText }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Reseteamos la altura del textarea
    if (inputRef.current) inputRef.current.style.height = "auto"

    try {
      // 2. Llamada limpia a la API de Axios (sin tocar localStorage)
      const data = await askChatbot(messageText)

      // 3. Respuesta del bot
      const textoFormateado = data.respuesta.replace(/\\n/g, '\n')
      const botMessage: Message = { id: Date.now() + 1, role: "bot", text: textoFormateado }
      setMessages((prev) => [...prev, botMessage])

    } catch (error: any) {
      if (error?.status === 401) {
        logout()
        return
      }
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: "Lo siento, tuve un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`
  }

  // ================= EXPORTACIÓN =================
  // Devolvemos solo lo que la interfaz visual necesita para funcionar
  return {
    messages,
    inputValue,
    isTyping,
    messagesEndRef,
    inputRef,
    handleSend,
    handleKeyDown,
    handleTextareaInput,
  }
}