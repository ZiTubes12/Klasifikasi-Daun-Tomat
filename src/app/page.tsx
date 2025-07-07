import { ImageGenerator } from "@/components/image-generator"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Fitur } from "@/components/gallery"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Hero />
      <ImageGenerator />
      <Fitur />
      <Features />
    </div>
  )
}
