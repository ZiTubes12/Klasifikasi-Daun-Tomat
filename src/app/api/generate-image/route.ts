import { fal } from "@ai-sdk/fal"
import { experimental_generateImage } from "ai"

export async function POST(req: Request) {
  try {
    const { prompt, model = "fal-ai/flux-pro/v1.1-ultra", aspectRatio = "1:1" } = await req.json()

    if (!prompt) {
      return Response.json(
        {
          success: false,
          error: "Prompt is required",
        },
        { status: 400 },
      )
    }

    const { image } = await experimental_generateImage({
      model: fal.image(model),
      prompt,
      aspectRatio,
    })

    // Convert image to base64 data URL for display
    const base64 = Buffer.from(image.uint8Array).toString("base64")
    const imageUrl = `data:image/png;base64,${base64}`

    return Response.json({
      success: true,
      imageUrl,
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to generate image",
      },
      { status: 500 },
    )
  }
}
