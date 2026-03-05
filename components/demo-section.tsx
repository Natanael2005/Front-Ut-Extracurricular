import { Bot, User } from "lucide-react"

const demoMessages = [
  {
    role: "user" as const,
    text: "Hola, necesito ayuda para integrar el chatbot en mi sitio web.",
  },
  {
    role: "bot" as const,
    text: "Con gusto te ayudo. Solo necesitas copiar un snippet de codigo en tu sitio. Soportamos React, Vue, Angular y HTML puro. Que stack utilizas?",
  },
  {
    role: "user" as const,
    text: "Usamos React. Se puede conectar con nuestro CRM?",
  },
  {
    role: "bot" as const,
    text: "Si, tenemos integracion nativa con Salesforce, HubSpot y mas de 50 plataformas. La configuracion toma menos de 10 minutos con nuestra guia paso a paso.",
  },
]

export function DemoSection() {
  return (
    <section id="como-funciona" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-medium uppercase tracking-widest text-primary">
              Como funciona
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Configuralo en minutos
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
              Nuestro chatbot entiende contexto, resuelve consultas complejas y aprende de cada interaccion para ofrecer respuestas cada vez mas precisas.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Entrena con tus datos</p>
                  <p className="text-sm text-muted-foreground">
                    Sube documentos, FAQs o conecta tu base de conocimiento.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Personaliza la apariencia</p>
                  <p className="text-sm text-muted-foreground">
                    Ajusta colores, tipografia y tono de voz del bot.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Publica y monitorea</p>
                  <p className="text-sm text-muted-foreground">
                    Despliega en minutos y sigue las metricas en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat preview */}
          <div className="rounded-2xl border border-border bg-card p-1">
            <div className="rounded-xl bg-secondary/50">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">NexaBot</p>
                  <p className="text-xs text-primary">En linea</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-5">
                {demoMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        msg.role === "bot"
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    >
                      {msg.role === "bot" ? (
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "bot"
                          ? "rounded-tl-md bg-card text-foreground"
                          : "rounded-tr-md bg-primary text-primary-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border px-4 py-3">
                <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5">
                  <span className="flex-1 text-sm text-muted-foreground">
                    Escribe un mensaje...
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <svg
                      className="h-4 w-4 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
