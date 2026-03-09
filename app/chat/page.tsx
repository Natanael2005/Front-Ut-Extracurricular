"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bot, Send, User, ArrowLeft, Sparkles } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { askChatbot } from "@/lib/chat-api"
// 1. Importamos el renderizador de Markdown
import ReactMarkdown from "react-markdown"

interface Message {
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

const suggestedPrompts = [
  "¿Quién da el taller de ajedrez?",
  "¿Qué horarios tiene el taller de música?",
  "¿Dónde se imparte el taller de robótica?",
  "¿Qué talleres hay disponibles los lunes?",
]

export default function ChatPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, logout } = useAuth() 

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      inputRef.current?.focus()
    }
  }, [isLoading, isAuthenticated])

  const handleSend = async (text?: string) => {
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

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No hay sesión activa")

      const data = await askChatbot(messageText, token)

      // 2. Limpiamos los saltos de línea literales de la API
      const textoFormateado = data.respuesta.replace(/\\n/g, '\n')

      const botMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: textoFormateado, 
      }
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

  const showSuggestions = messages.length <= 1 && !isTyping

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground animate-pulse">Verificando credenciales...</p>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/" aria-label="Volver al inicio">
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
          {showSuggestions && (
            <div className="mb-8 mt-8 flex flex-col items-center text-center md:mt-16">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">¿Cómo puedo ayudarte?</h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Escribe tu pregunta o selecciona una de las sugerencias para conocer más sobre los talleres.
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
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "bot"
                      ? "rounded-tl-md bg-card border border-border text-foreground"
                      : "rounded-tr-md bg-primary text-primary-foreground"
                  }`}
                >
                  {/* 3. AQUI RENDERIZAMOS EL MARKDOWN INTELIGENTE */}
                  {msg.role === "bot" ? (
                    <ReactMarkdown
                      components={{
                        // Le decimos a Tailwind cómo pintar los estilos de Markdown
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
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
              disabled={!inputValue.trim() || isTyping}
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