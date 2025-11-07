"use client"

import { useEffect, useState } from "react"
import { Github, Video, ExternalLink } from "lucide-react"
import Image from "next/image"

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

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

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

  if (loading) {
    return (
      <section className="mt-10 p-5 pb-20 md:px-[15%] bg-stone-950" id="Projects">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 mt-10">
          Mes <span className="text-accent">  Projets</span>
        </h2>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-10 p-5 pb-20 md:px-[15%] bg-stone-950" id="Projects">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 mt-10">
        Mes <span className="text-accent">  Projets</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-base-300 p-4 sm:p-5 rounded-xl shadow-lg flex flex-col border-2 border-base-content/20 transition-transform hover:scale-105 hover:border-accent hover:border-4"
            style={{
              height: 'clamp(450px, 70vh, 700px)'
            }}
          >
            {/* Image avec hauteur fixe */}
            <div className="flex-shrink-0 mb-4">
              <img
                src={project.image}
                alt={project.title}
                className="w-full rounded-xl h-48 object-cover"
              />
            </div>

            {/* Titre avec hauteur fixe */}
            <div className="flex-shrink-0 mb-3">
              <h1 className="font-bold text-lg line-clamp-2">
                {project.title}
              </h1>
            </div>

            {/* Zone de description avec scrollbar */}
            <div className="flex-1 min-h-0 mb-3">
              <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-sm leading-relaxed">{project.description}</p>
              </div>
            </div>

            {/* Technologies avec hauteur fixe */}
            <div className="flex-shrink-0 flex flex-wrap gap-2 mb-3">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="badge badge-accent badge-sm">
                  {tech}
                </span>
              ))}
            </div>

            {/* Boutons toujours en bas */}
            <div className="flex-shrink-0 flex flex-wrap gap-2 mt-auto">
              {project.demoLink ? (
                <a 
                  className="btn btn-accent text-white flex-1 min-w-[100px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50 active:scale-95" 
                  href={project.demoLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span className="hidden sm:inline">Démo</span>
                  <Video className="w-4 sm:ml-1" />
                </a>
              ) : null}

              {project.liveLink ? (
                <a 
                  className="btn btn-primary text-white flex-1 min-w-[100px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50 active:scale-95" 
                  href={project.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span className="hidden sm:inline">Visiter</span>
                  <ExternalLink className="w-4 sm:ml-1" />
                </a>
              ) : null}

              {project.repoLink ? (
                <a 
                  className="btn btn-secondary text-white flex-1 sm:flex-initial min-w-[100px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/50 active:scale-95" 
                  href={project.repoLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span className="hidden sm:inline">Code source</span>
                  <Github className="w-4 sm:ml-1" />
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl">Aucun projet pour le moment</p>
        </div>
      )}
    </section>
  )
}

export default Projects

