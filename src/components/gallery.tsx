import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, CheckCircle, History } from "lucide-react"

const features = [
  {
    icon: <Upload className="h-8 w-8 text-green-700 mb-2" />,
    title: "Upload Gambar Daun Tomat",
    description: "Unggah foto daun Tomat yang ingin Anda klasifikasikan.",
  },
  {
    icon: <Search className="h-8 w-8 text-green-700 mb-2" />,
    title: "Klasifikasi Otomatis",
    description: "Sistem akan secara otomatis mendeteksi dan mengklasifikasikan penyakit pada daun anggur.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-700 mb-2" />,
    title: "Hasil & Saran Penanganan",
    description: "Dapatkan hasil klasifikasi beserta saran penanganan penyakit daun anggur.",
  },
  // {
  //   icon: <History className="h-8 w-8 text-green-700 mb-2" />,
  //   title: "Riwayat Klasifikasi",
  //   description: "Lihat riwayat klasifikasi yang telah Anda lakukan sebelumnya.",
  // },
]

export function Fitur() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Fitur Website</h2>
          <p className="text-lg text-gray-600">Website ini membantu Anda mengklasifikasikan penyakit pada daun anggur secara cepat dan akurat</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {features.map((fitur, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col items-center text-center p-6">
              {fitur.icon}
              <CardContent className="p-0">
                <h3 className="font-semibold text-lg mb-2">{fitur.title}</h3>
                <p className="text-sm text-gray-600">{fitur.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
