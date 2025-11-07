import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log("L'utilisateur admin existe déjà")
    return
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // Créer l'utilisateur admin
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("Utilisateur admin créé avec succès:", admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

