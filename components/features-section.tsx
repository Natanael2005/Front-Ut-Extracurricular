import { MessageSquare, Zap, Shield, Globe, BarChart3, Puzzle } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Conversaciones naturales",
    description:
      "Procesamiento de lenguaje natural avanzado para entender y responder como un humano.",
  },
  {
    icon: Zap,
    title: "Respuestas instantaneas",
    description:
      "Latencia inferior a un segundo para mantener a tus usuarios comprometidos sin esperas.",
  },
  {
    icon: Shield,
    title: "Seguridad empresarial",
    description:
      "Cifrado de extremo a extremo y cumplimiento con GDPR para proteger tus datos.",
  },
  {
    icon: Globe,
    title: "Multilenguaje",
    description:
      "Soporte para mas de 50 idiomas con deteccion automatica del idioma del usuario.",
  },
  {
    icon: BarChart3,
    title: "Analitica avanzada",
    description:
      "Panel de control en tiempo real con metricas de satisfaccion y rendimiento.",
  },
  {
    icon: Puzzle,
    title: "Integraciones faciles",
    description:
      "Conecta con Slack, WhatsApp, Telegram, tu web y muchas plataformas mas.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Caracteristicas
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Todo lo que necesitas en un chatbot
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Funcionalidades potentes para automatizar y mejorar la experiencia de tus usuarios.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:bg-card/80"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
