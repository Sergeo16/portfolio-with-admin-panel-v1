import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations"
import { z } from "zod"

// GET - Récupérer un projet par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...project,
      technologies: JSON.parse(project.technologies || "[]"),
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du projet" },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un projet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = projectSchema.parse(body)

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        technologies: JSON.stringify(validatedData.technologies),
        demoLink: validatedData.demoLink || null,
        liveLink: validatedData.liveLink || null,
        repoLink: validatedData.repoLink || null,
        image: validatedData.image,
      },
    })

    return NextResponse.json({
      ...project,
      technologies: JSON.parse(project.technologies),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du projet" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un projet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Projet supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du projet" },
      { status: 500 }
    )
  }
}

