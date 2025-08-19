"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Mapping label ke penanganan
const TREATMENT_MAP: Record<string, string> = {
  "Tomato Bacterial spot": "Gunakan fungisida berbahan aktif tembaga dan buang daun yang terinfeksi.",
  "Tomato___Bacterial_spot": "Gunakan fungisida berbahan aktif tembaga (copper-based), buang daun yang terinfeksi, dan hindari percikan air pada daun.",
  "Tomato Early blight": "Pangkas daun yang terinfeksi, gunakan fungisida, dan rotasi tanaman.",
  "Tomato___Early_blight": "Pangkas daun yang menunjukkan bercak, gunakan fungisida berbahan aktif klorotalonil/mankozeb, perbaiki sirkulasi udara, dan lakukan rotasi tanaman.",
  "Tomato___Late_blight": "Segera buang bagian tanaman yang terinfeksi, gunakan fungisida sistemik yang sesuai (contoh: metalaksil), hindari penyiraman dari atas, dan jaga jarak tanam.",
  "Tomato___Leaf_Mold": "Kurangi kelembapan dengan meningkatkan ventilasi, hindari penyiraman malam hari, gunakan fungisida yang sesuai (contoh: klorotalonil), dan bersihkan daun tua di permukaan media.",
  "Tomato Septoria_leaf spot": "Hindari penyiraman dari atas, buang daun terinfeksi, dan gunakan fungisida.",
  "Tomato___Septoria_leaf_spot": "Hindari penyiraman dari atas, buang daun yang terinfeksi, gunakan mulsa, dan semprot fungisida protektif secara berkala.",
  "Tomato___Spider_mites_Two_spotted_spider_mite": "Kendalikan tungau dengan semprotan air bertekanan pada bagian bawah daun, gunakan akarisida/mitisida bila perlu, dan dorong musuh alami (misal: Phytoseiulus persimilis).",
  "Tomato Target_Spot": "Gunakan fungisida yang sesuai dan jaga kebersihan lahan.",
  "Tomato___Target_Spot": "Gunakan fungisida sesuai anjuran, pangkas daun terinfeksi, dan lakukan sanitasi kebun untuk mengurangi sumber inokulum.",
  "Tomato___Tomato_YellowLeaf_Curl_Virus": "Cabut dan musnahkan tanaman terinfeksi, kendalikan vektor kutu kebul (Bemisia tabaci) dengan insektisida dan perangkap kuning, gunakan varietas tahan, dan pasang mulsa perak.",
  "Tomato___Tomato_mosaic_virus": "Musnahkan tanaman terinfeksi, sanitasi alat dan tangan (larutan pemutih), hindari merokok/produk tembakau saat menangani tanaman, dan gunakan benih bebas virus.",
  "Tomato healthy": "Tanaman sehat, lakukan pemantauan rutin dan perawatan standar.",
  "Tomato___healthy": "Tanaman sehat, lanjutkan pemeliharaan rutin (pemupukan seimbang, penyiraman tepat, dan pemantauan hama/penyakit).",
  "not_a_tomato_plant": "Ini bukan daun tanaman tomat. Silakan unggah gambar daun tanaman tomat yang benar."
}



export function ImageGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [classification, setClassification] = useState<null | { label: string; prob: string }>(null)
  const [treatment, setTreatment] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isNotTomato, setIsNotTomato] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    setClassification(null)
    setTreatment(null)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast("Please select an image to upload.")
      return
    }
    setIsUploading(true)
    setIsNotTomato(false)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      const response = await fetch("https://zaiy-klasifikasi-tomat.hf.space/predict?file", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (data.probabilities) {
        const probs: Record<string, string> = data.probabilities;
        const entries = Object.entries(probs);
        const [maxLabel, maxProb] = entries.reduce(
          (max, curr) => (parseFloat(curr[1]) > parseFloat(max[1]) ? curr : max),
          entries[0]
        );
        if (parseFloat(maxProb) < 80) {
          setClassification(null);
          setTreatment(null);
          setIsNotTomato(true);
        } else {
          setClassification({ label: maxLabel, prob: maxProb });
          setTreatment(TREATMENT_MAP[maxLabel] || "Penanganan tidak tersedia.");
          setIsNotTomato(false);
          toast("Image classified successfully!")
        }
        console.log("maxLabel", maxLabel, "maxProb", maxProb);
      } else {
        setClassification(null)
        setTreatment(null)
        setIsNotTomato(false)
        toast("Failed to classify image.")
      }
    } catch (error) {
      setClassification(null)
      setTreatment(null)
      setIsNotTomato(false)
      toast("Error uploading or classifying image.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section id="generator" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Image Classification</h2>
            <p className="text-lg text-gray-600">Upload an image and see the classification result</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Section kiri: hasil klasifikasi dan preview gambar */}
            <Card>
              <CardHeader>
                <CardTitle>Classification Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-64 h-64 object-contain rounded-lg border mb-4"
                    />
                  ) : (
                    <div className="text-gray-500 text-center mb-4">No image selected</div>
                  )}
                  {isNotTomato ? (
                    <div className="flex flex-col items-center justify-center w-full mt-4">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="#e11d48" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="#e11d48" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <div className="text-red-600 font-bold text-center">
                        Ini bukan gambar daun tanaman tomat, silakan unggah kembali daun tanaman tomat
                      </div>
                    </div>
                  ) : classification && classification.label === "not_a_tomato_plant" ? (
                    <div className="flex flex-col items-center justify-center w-full mt-4">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="#e11d48" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="#e11d48" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <div className="text-red-600 font-bold text-center">
                        Ini bukan gambar daun tanaman tomat, silakan unggah kembali daun tanaman tomat
                      </div>
                    </div>
                  ) : classification ? (
                    <div className="w-full mt-4">
                      <div className="text-lg font-semibold text-green-700 mb-2">
                        Hasil Klasifikasi:
                      </div>
                      <div className="text-xl font-bold text-gray-900 mb-2">
                        {classification.label} <span className="text-base font-normal text-gray-600">({classification.prob})</span>
                      </div>
                      <div className="mt-4 p-4 rounded bg-green-50 border border-green-200">
                        <div className="font-semibold text-green-800 mb-1">Saran Penanganan:</div>
                        <div className="text-green-900">{treatment}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">No classification yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Section kanan: upload gambar */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <Button onClick={handleUpload} disabled={isUploading || !selectedFile} className="w-full" size="lg">
                    {isUploading ? "Uploading..." : "Upload & Classify"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Video YouTube dihilangkan sesuai permintaan */}
        </div>
      </div>
    </section>
  )
}
