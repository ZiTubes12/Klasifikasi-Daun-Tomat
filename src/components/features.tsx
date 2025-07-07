import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, UserX, Activity, XCircle, Info } from "lucide-react"

const problems = [
  {
    icon: AlertTriangle,
    title: "Sulit Mengenali Gejala Penyakit",
    description:
      "Banyak petani kesulitan membedakan gejala penyakit daun tomat secara visual, sehingga penanganan sering terlambat.",
  },
 
  {
    icon: UserX,
    title: "Kurangnya Akses ke Ahli",
    description: "Tidak semua petani memiliki akses ke ahli tanaman untuk konsultasi secara langsung.",
  },
  {
    icon: Activity,
    title: "Penyebaran Penyakit yang Cepat",
    description: "Penyakit daun tomat dapat menyebar dengan cepat jika tidak segera diidentifikasi dan ditangani.",
  },
  {
    icon: XCircle,
    title: "Salah Penggunaan Pestisida",
    description: "Kurangnya informasi menyebabkan penggunaan pestisida yang tidak tepat dan berpotensi merusak tanaman.",
  },
  {
    icon: Info,
    title: "Minim Informasi Penanganan",
    description: "Petani sering kesulitan mendapatkan informasi penanganan yang tepat dan akurat untuk setiap jenis penyakit.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Permasalahan yang Dihadapi Petani Tomat</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Berikut adalah beberapa permasalahan utama yang sering dialami petani tomat terkait penyakit daun, sehingga dibutuhkan solusi berbasis teknologi seperti website ini.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-lime-600 text-white">
                  <problem.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
