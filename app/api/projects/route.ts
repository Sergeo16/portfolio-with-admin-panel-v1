import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations"
import { z } from "zod"

// GET - Récupérer tous les projets
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    })

    // Parser les technologies depuis JSON
    const formattedProjects = projects.map((project) => ({
      ...project,
      technologies: JSON.parse(project.technologies || "[]"),
    }))

    return NextResponse.json(formattedProjects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des projets" },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau projet
export async function POST(request: NextRequest) {
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

    const project = await prisma.project.create({
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
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du projet" },
      { status: 500 }
    )
  }
}

