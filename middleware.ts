import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Si on accède à /admin/login et qu'on est déjà connecté, rediriger vers /admin
  if (request.nextUrl.pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Si on accède à /admin (sauf login) et qu'on n'est pas connecté ou pas ADMIN
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

