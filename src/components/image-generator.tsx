"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Mapping label ke penanganan
const TREATMENT_MAP: Record<string, string> = {
  "Tomato__Bacterial_spot": "Gunakan benih sehat, hindari penyiraman dari atas, buang daun terinfeksi, dan gunakan fungisida berbahan tembaga.",
  "Tomato__Early_blight": "Rotasi tanaman, buang daun terinfeksi, dan gunakan fungisida jika diperlukan.",
  "Tomato__healthy": "Tanaman sehat, lakukan perawatan rutin dan pemantauan secara berkala.",
  "Tomato__Late_blight": "Segera buang tanaman terinfeksi, gunakan varietas tahan penyakit, dan semprot fungisida preventif.",
  "Tomato__Leaf_Mold": "Tingkatkan sirkulasi udara, hindari kelembapan berlebih, dan gunakan fungisida jika diperlukan.",
  "Tomato__Septoria_leaf_spot": "Buang daun terinfeksi, hindari penyiraman dari atas, dan gunakan fungisida.",
  "Tomato__Spider_mites_Two_spotted_spider_mite": "Semprot daun dengan air, gunakan insektisida nabati (misal: minyak neem), dan jaga kelembapan lingkungan.",
  "Tomato__Target_Spot": "Buang daun terinfeksi, gunakan fungisida, dan lakukan rotasi tanaman.",
  "Tomato__Tomato_mosaic_virus": "Cabut dan musnahkan tanaman terinfeksi, gunakan benih bebas virus, dan jaga kebersihan alat pertanian.",
  "Tomato__Tomato_YellowLeaf_Curl_Virus": "Cabut tanaman terinfeksi, kendalikan kutu putih, dan gunakan varietas tahan virus."
}

// Mapping label ke link edukasi/video
const VIDEO_MAP: Record<string, string> = {
  "Tomato__Bacterial_spot": "https://plantvillage.psu.edu/topics/tomato/infos/diseases_bacterial-spot",
  "Tomato__Early_blight": "https://plantvillage.psu.edu/topics/tomato/infos/diseases_early-blight",
  "Tomato__healthy": "https://www.gardeningknowhow.com/edible/vegetables/tomato/growing-tomatoes.htm",
  "Tomato__Late_blight": "https://plantvillage.psu.edu/topics/tomato/infos/diseases_late-blight",
  "Tomato__Leaf_Mold": "https://plantvillage.psu.edu/topics/tomato/infos/diseases_leaf-mold",
  "Tomato__Septoria_leaf_spot": "https://plantvillage.psu.edu/topics/tomato/infos/diseases_septoria-leaf-spot",
  "Tomato__Spider_mites_Two_spotted_spider_mite": "https://plantvillage.psu.edu/topics/tomato/infos/pests_two-spotted-spider-mite",
  "Tomato__Target_Spot": "https://www.apsnet.org/edcenter/disandpath/fungalasco/pdlessons/Pages/TargetSpotTomato.aspx",
  "Tomato__Tomato_mosaic_virus": "https://plantvillage.psu.edu/topics/tomato/infos/diseases_tomato-mosaic-virus",
  "Tomato__Tomato_YellowLeaf_Curl_Virus": "https://plantvillage.psu.edu/topics/tomato/infos/diseases_tomato-yellow-leaf-curl-virus"
}

export function ImageGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [classification, setClassification] = useState<null | { label: string; prob: string }>(null)
  const [treatment, setTreatment] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isOOD, setIsOOD] = useState(false)

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
    setIsOOD(false)
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
        if (parseFloat(maxProb) < 0.85) {
          setClassification(null);
          setTreatment(null);
          setIsOOD(true);
        } else {
          setClassification({ label: maxLabel, prob: maxProb });
          setTreatment(TREATMENT_MAP[maxLabel] || "Penanganan tidak tersedia.");
          setIsOOD(false);
        }
        toast("Image classified successfully!")
      } else {
        setClassification(null)
        setTreatment(null)
        setIsOOD(false)
        toast("Failed to classify image.")
      }
    } catch (error) {
      setClassification(null)
      setTreatment(null)
      setIsOOD(false)
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
                  {isOOD ? (
                    <div className="text-red-600 font-semibold text-center">Gambar yang diunggah bukan daun tanaman tomat.</div>
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
          {/* Section video di bawah grid */}
          {classification && !isOOD && VIDEO_MAP[classification.label] && (
            <div className="mt-12 flex flex-col items-center">
              <div className="font-semibold text-green-800 mb-2 text-lg">Video Penanganan:</div>
              <a
                href={VIDEO_MAP[classification.label]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline hover:text-blue-900 mb-4"
              >
                Lihat Video di YouTube
              </a>
              <div className="aspect-video w-full max-w-2xl mx-auto">
                <iframe
                  width="100%"
                  height="400"
                  src={
                    VIDEO_MAP[classification.label].includes("watch?v=")
                      ? "https://www.youtube.com/embed/" +
                        VIDEO_MAP[classification.label].split("watch?v=")[1].split("&")[0]
                      : VIDEO_MAP[classification.label]
                  }
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
