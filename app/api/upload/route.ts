import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Formats acceptés: PNG, JPEG, JPG, WEBP, GIF" },
        { status: 400 }
      )
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Le fichier est trop volumineux. Taille maximale: 5MB" },
        { status: 400 }
      )
    }

    // Créer le dossier s'il n'existe pas
    const uploadDir = join(process.cwd(), "public", "uploads", "projects")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${originalName}`
    const filepath = join(uploadDir, filename)

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Retourner le chemin relatif pour l'utilisation dans l'application
    const relativePath = `/uploads/projects/${filename}`

    return NextResponse.json({ 
      success: true,
      path: relativePath 
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    )
  }
}

