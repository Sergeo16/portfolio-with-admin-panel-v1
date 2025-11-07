import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portfolio - Serge SATCHI",
  description: "Portfolio de Serge SATCHI - Développeur FullStack",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" data-theme="dark">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}

