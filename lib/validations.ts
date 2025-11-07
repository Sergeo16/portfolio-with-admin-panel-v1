import { z } from "zod"

export const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  technologies: z.array(z.string()).min(1, "Au moins une technologie est requise"),
  demoLink: z.string().url("URL invalide").optional().or(z.literal("")),
  liveLink: z.string().url("URL invalide").optional().or(z.literal("")),
  repoLink: z.string().url("URL invalide").optional().or(z.literal("")),
  image: z.string().min(1, "L'image est requise"),
})

export type ProjectFormData = z.infer<typeof projectSchema>

