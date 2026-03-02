import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Bot, Send, User, ArrowLeft, Sparkles } from "lucide-react"

interface Message {
  id: number
  role: "user" | "bot"
  text: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "Hola! Soy NexaBot, tu asistente virtual. Puedes preguntarme lo que necesites y estare encantado de ayudarte.",
  },
]

const botResponses = [
  "Excelente pregunta! Nuestro chatbot se integra facilmente con cualquier plataforma. Solo necesitas un snippet de codigo para empezar.",
  "Puedo ayudarte con informacion sobre caracteristicas, integraciones o soporte tecnico. Que necesitas saber?",
  "Contamos con integraciones nativas con Slack, WhatsApp, Telegram y muchas plataformas mas. La configuracion es muy sencilla.",
  "Nuestro motor de IA procesa mas de 50 idiomas con deteccion automatica. Tus usuarios pueden escribir en su idioma preferido.",
  "La seguridad es nuestra prioridad. Contamos con cifrado de extremo a extremo y cumplimiento con GDPR y SOC2.",
  "El tiempo promedio de respuesta es inferior a 1 segundo, lo que garantiza una experiencia fluida para tus usuarios.",
  "Puedes personalizar completamente la apariencia del chatbot: colores, tipografia, avatar y tono de voz.",
  "Nuestro panel de analitica te muestra metricas en tiempo real: satisfaccion, volumen de consultas y temas frecuentes.",
]

const suggestedPrompts = [
  "Como integro NexaBot en mi sitio web?",
  "Que idiomas soporta el chatbot?",
  "Como funciona la analitica?",
  "Cuales integraciones tienen disponibles?",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }

    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      const botMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: randomResponse,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 800)
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

  const showSuggestions = messages.length <= 1 && !isTyping

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" asChild>
            <Link to="/" aria-label="Volver al inicio">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">NexaBot</p>
              <p className="text-xs text-primary">En linea</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">IA Avanzada</span>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
          {/* Welcome state with suggestions */}
          {showSuggestions && (
            <div className="mb-8 mt-8 flex flex-col items-center text-center md:mt-16">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Como puedo ayudarte?</h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Escribe tu pregunta o selecciona una de las sugerencias para comenzar la conversacion.
              </p>
              <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-all hover:border-primary/40 hover:bg-card/80"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex flex-col gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "bot" ? "bg-primary" : "bg-muted"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "bot"
                      ? "rounded-tl-md bg-card border border-border text-foreground"
                      : "rounded-tr-md bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card/50 px-4 py-4 backdrop-blur-xl md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3 rounded-2xl border border-border bg-card p-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              rows={1}
              className="max-h-[150px] min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar mensaje</span>
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            NexaBot puede cometer errores. Verifica la informacion importante.
          </p>
        </div>
      </div>
    </div>
  )
}
