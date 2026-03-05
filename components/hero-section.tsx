import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/25 blur-[128px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">Impulsado por IA avanzada</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
          Tu asistente virtual
          <span className="text-primary"> inteligente</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          Descubre el extracurricular ideal para ti, encuentra actividades que se adapten a ti. Recibe recomendaciones personalizadas.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/chat">
              Probar ahora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">10M+</span>
            <span>Mensajes procesados</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">99.9%</span>
            <span>Disponibilidad</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">{'<'}1s</span>
            <span>Tiempo de respuesta</span>
          </div>
        </div> */}
      </div>
    </section>
  )
}
