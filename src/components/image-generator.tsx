"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Mapping label ke penanganan
const TREATMENT_MAP: Record<string, string> = {
  "Tomato Bacterial spot": "Gunakan fungisida berbahan aktif tembaga dan buang daun yang terinfeksi.",
  "Tomato Early blight": "Pangkas daun yang terinfeksi, gunakan fungisida, dan rotasi tanaman.",
  "Tomato Septoria_leaf spot": "Hindari penyiraman dari atas, buang daun terinfeksi, dan gunakan fungisida.",
  "Tomato Target_Spot": "Gunakan fungisida yang sesuai dan jaga kebersihan lahan.",
  "Tomato healthy": "Tanaman sehat, lakukan pemantauan rutin dan perawatan standar.",
}

// Mapping label ke link video YouTube
const VIDEO_MAP: Record<string, string> = {
  "Tomato Bacterial spot": "https://www.youtube.com/watch?v=QwQnYgkzF5A",
  "Tomato Early blight": "https://www.youtube.com/watch?v=s9ztEw_r9R4",
  "Tomato Septoria_leaf spot": "https://www.youtube.com/watch?v=HTFdohZbeAo",
  "Tomato Target_Spot": "https://www.youtube.com/watch?v=4QkQbQn6p9C",
  "Tomato healthy": "https://www.youtube.com/watch?v=5QkQbQn6p9D",
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
                      <img src="/window.svg" alt="Not tomato leaf" className="w-20 h-20 mb-2" />
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
          {/* Section video di bawah grid */}
          {classification && VIDEO_MAP[classification.label] && (
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
