import { Bot } from "lucide-react"

const footerLinks = {
  Producto: ["Caracteristicas", "Integraciones", "Changelog"],
  Empresa: ["Acerca de", "Blog", "Carreras", "Contacto"],
  Legal: ["Privacidad", "Terminos", "Cookies"],
  Soporte: ["Documentacion", "API", "Estado del servicio", "Comunidad"],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">NexaBot</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Automatiza conversaciones con IA y transforma la experiencia de tus clientes.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground">{category}</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            2026 NexaBot. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Twitter
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
