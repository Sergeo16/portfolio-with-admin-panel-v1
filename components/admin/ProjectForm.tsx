"use client"

import { useState, useEffect, useRef } from "react"
import { ProjectFormData } from "@/lib/validations"
import { Paperclip, Link as LinkIcon, X } from "lucide-react"

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

interface ProjectFormProps {
  project?: Project | null
  onSubmit: () => void
  onCancel: () => void
}

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    technologies: [],
    demoLink: "",
    liveLink: "",
    repoLink: "",
    image: "",
  })
  const [techInput, setTechInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageMode, setImageMode] = useState<"upload" | "url">("url")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        demoLink: project.demoLink || "",
        liveLink: project.liveLink || "",
        repoLink: project.repoLink || "",
        image: project.image,
      })
      // Déterminer le mode selon si l'image est une URL ou un chemin local
      if (project.image && (project.image.startsWith("http") || project.image.startsWith("//"))) {
        setImageMode("url")
      } else {
        setImageMode("upload")
      }
      setImagePreview(project.image)
    }
  }, [project])

  useEffect(() => {
    // Mettre à jour l'aperçu quand formData.image change
    if (formData.image) {
      setImagePreview(formData.image)
    }
  }, [formData.image])

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Type de fichier non autorisé. Formats acceptés: PNG, JPEG, JPG, WEBP, GIF")
      return
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError("Le fichier est trop volumineux. Taille maximale: 5MB")
      return
    }

    setUploadingImage(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de l'upload")
      }

      const data = await res.json()
      setFormData((prev) => ({ ...prev, image: data.path }))
      setImagePreview(data.path)
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'upload de l'image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageModeChange = (mode: "upload" | "url") => {
    setImageMode(mode)
    if (mode === "upload") {
      setFormData((prev) => ({ ...prev, image: "" }))
      setImagePreview("")
    } else {
      setFormData((prev) => ({ ...prev, image: "" }))
      setImagePreview("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validation de l'image
    if (!formData.image || formData.image.trim() === "") {
      setError("L'image de couverture est requise")
      return
    }

    setLoading(true)

    try {
      const url = project ? `/api/projects/${project.id}` : "/api/projects"
      const method = project ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de la sauvegarde")
      }

      onSubmit()
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-base-300 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        {project ? "Modifier le projet" : "Nouveau projet"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="label">
            <span className="label-text">Titre *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Description *</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={4}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Technologies *</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="input input-bordered flex-1"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTech()
                }
              }}
              placeholder="Ajouter une technologie"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="btn btn-accent"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech) => (
              <span key={tech} className="badge badge-accent badge-lg">
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="ml-2"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Lien démo</span>
          </label>
          <input
            type="url"
            className="input input-bordered w-full"
            value={formData.demoLink}
            onChange={(e) =>
              setFormData({ ...formData, demoLink: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Lien live</span>
          </label>
          <input
            type="url"
            className="input input-bordered w-full"
            value={formData.liveLink}
            onChange={(e) =>
              setFormData({ ...formData, liveLink: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Lien repo GitHub</span>
          </label>
          <input
            type="url"
            className="input input-bordered w-full"
            value={formData.repoLink}
            onChange={(e) =>
              setFormData({ ...formData, repoLink: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Image de couverture *</span>
          </label>
          
          {/* Sélecteur de mode */}
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleImageModeChange("upload")}
              className={`btn btn-sm ${imageMode === "upload" ? "btn-accent" : "btn-outline"}`}
            >
              <Paperclip className="w-4 h-4 mr-1" />
              Upload
            </button>
            <button
              type="button"
              onClick={() => handleImageModeChange("url")}
              className={`btn btn-sm ${imageMode === "url" ? "btn-accent" : "btn-outline"}`}
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              URL
            </button>
          </div>

          {/* Zone d'upload */}
          {imageMode === "upload" ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="btn btn-outline btn-accent flex-1"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  {uploadingImage ? "Upload en cours..." : "Choisir une image"}
                </button>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: "" }))
                      setImagePreview("")
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                    className="btn btn-outline btn-error"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {formData.image && (
                <div className="text-sm text-base-content/70">
                  Fichier sélectionné: {formData.image}
                </div>
              )}
            </div>
          ) : (
            /* Zone d'URL */
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required={imageMode === "url"}
              placeholder="Joindre une image ou un lien d'image"
            />
          )}

          {/* Aperçu de l'image */}
          {imagePreview && (
            <div className="mt-3">
              <div className="label">
                <span className="label-text text-sm">Aperçu:</span>
              </div>
              <div className="relative w-full h-48 border border-base-content/20 rounded-lg overflow-hidden bg-base-200">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-full object-contain"
                  onError={() => setImagePreview("")}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="btn btn-accent flex-1"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-neutral"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

