"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bot, X, Send, User, Minus } from "lucide-react"

interface Message {
  id: number
  role: "user" | "bot"
  text: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "Hola! Soy NexaBot, tu asistente virtual. En que puedo ayudarte hoy?",
  },
]

const botResponses = [
  "Excelente pregunta! Nuestro chatbot se integra facilmente con cualquier plataforma. Solo necesitas un snippet de codigo.",
  "Puedo ayudarte con informacion sobre precios, caracteristicas o soporte tecnico. Que necesitas?",
  "Nuestro plan Pro incluye 50,000 mensajes al mes y analitica avanzada. Quieres que te cuente mas?",
  "Tenemos integraciones con Slack, WhatsApp, Telegram y muchas mas. La configuracion es muy sencilla.",
  "Si, ofrecemos una prueba gratuita de 14 dias del plan Pro. Quieres comenzar ahora?",
]

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: inputValue.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulated bot response
    setTimeout(() => {
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)]
      const botMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: randomResponse,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5 transition-all ${
            isMinimized ? "h-14" : "h-[520px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">NexaBot</p>
                <p className="text-xs text-primary">En linea</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={isMinimized ? "Expandir chat" : "Minimizar chat"}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex h-[calc(100%-120px)] flex-col gap-3 overflow-y-auto p-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        msg.role === "bot" ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      {msg.role === "bot" ? (
                        <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                        msg.role === "bot"
                          ? "rounded-bl-md bg-secondary text-foreground"
                          : "rounded-br-md bg-primary text-primary-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                    <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border px-3 py-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 rounded-xl border-0 bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Enviar mensaje</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
          setIsMinimized(false)
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
        aria-label={isOpen ? "Cerrar chatbot" : "Abrir chatbot"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Bot className="h-6 w-6 text-primary-foreground" />
        )}
      </button>
    </>
  )
}
