"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, LogOut } from "lucide-react"
import ProjectForm from "@/components/admin/ProjectForm"
import { ProjectFormData } from "@/lib/validations"

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  demoLink: string | null
  liveLink: string | null
  repoLink: string | null
  image: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchProjects()
    }
  }, [session])

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchProjects()
      } else {
        alert("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleFormSubmit = () => {
    setShowForm(false)
    setEditingProject(null)
    fetchProjects()
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
            Administration <span className="text-accent">Projets</span>
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="btn btn-error text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-error/50 active:scale-95 w-full sm:w-auto"
          >
            <LogOut className="w-4" />
            <span className="ml-2">Déconnexion</span>
          </button>
        </div>

        <button
          onClick={() => {
            setEditingProject(null)
            setShowForm(true)
          }}
          className="btn btn-accent mb-6"
        >
          <Plus className="w-4" />
          Nouveau projet
        </button>

        {showForm && (
          <div className="mb-8">
            <ProjectForm
              project={editingProject}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingProject(null)
              }}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-base-300 p-5 rounded-xl shadow-lg">
              <img
                src={project.image}
                alt={project.title}
                className="w-full rounded-xl h-48 object-cover mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-sm mb-4 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="badge badge-accent badge-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="btn btn-primary flex-1"
                >
                  <Edit className="w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="btn btn-error"
                >
                  <Trash2 className="w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl">Aucun projet pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}

