"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Sparkles, Zap, Info } from "lucide-react"

export function Hero() {
  const scrollToGenerator = () => {
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-lime-600 to-green-400 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
              <Sparkles className="h-12 w-12" />
            </div>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Klasifikasi Penyakit Daun Tomat
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Berbasis Citra Digital
            </span>
          </h1>

          <p className="mb-8 text-xl text-white/90 md:text-2xl">
            Deteksi dan identifikasi penyakit daun tomat secara otomatis dan cepat hanya dengan mengunggah foto daun. Solusi praktis untuk petani, peneliti, dan pemerhati tanaman.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-white/90" onClick={scrollToGenerator}>
              <Zap className="mr-2 h-5 w-5" />
              Mulai Klasifikasi
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Info className="mr-2 h-5 w-5" />
              Tentang Website
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" onClick={scrollToGenerator}>
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </Button>
        </div>
      </div>
    </section>
  )
}
