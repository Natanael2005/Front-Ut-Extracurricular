import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { DemoSection } from "@/components/demo-section"
import { Footer } from "@/components/footer"

// Importa el widget del chatbot en la landing page
// // import { ChatbotWidget } from "@/components/chatbot-widget"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
      </main>
      <Footer />

      {/* Renderiza el widget del chatbot en la landing page */}
      {/* <ChatbotWidget /> */}
    </>
  )
}
