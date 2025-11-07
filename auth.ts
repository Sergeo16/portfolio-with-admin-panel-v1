import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis")
        }

        // Validation avec Zod
        const validatedFields = loginSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        })

        if (!validatedFields.success) {
          throw new Error(validatedFields.error.errors[0].message)
        }

        const { email, password } = validatedFields.data

        // Recherche de l'utilisateur
        const user = await prisma.user.findUnique({
          where: { email: email as string },
        })

        if (!user) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)

        if (!isPasswordValid) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // Vérification du rôle
        if (user.role !== "ADMIN") {
          throw new Error("Accès refusé")
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

