import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { UserRole } from "./lib/auth"

const roleRoutes: Record<UserRole, string[]> = {
  admin: ["/admin", "/manager", "/cashier", "/user"], // Admins can access all routes
  user: ["/user"], // Users can only access user routes
  cashier: ["/cashier"], // Cashiers can only access cashier routes
  manager: ["/manager", "/cashier", "/user"], // Managers can access manager, cashier, and user routes
}

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/unauthorized"]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If no session and trying to access protected route
  if (!session && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If has session, check role-based access
  if (session && !isPublicRoute) {
    try {
      const user = JSON.parse(session.value)

      const roleSpecificRoutes = ["/admin", "/user", "/cashier", "/manager"]
      const isRoleSpecificRoute = roleSpecificRoutes.some((route) => pathname.startsWith(route))

      if (isRoleSpecificRoute) {
        const allowedRoutes = roleRoutes[user.role as UserRole] || []
        const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route))

        if (!hasAccess) {
          return NextResponse.redirect(new URL("/unauthorized", request.url))
        }
      }

      // If trying to access login page with valid session, redirect to appropriate dashboard
      if (pathname === "/login") {
        const dashboardUrl = `/${user.role}`
        return NextResponse.redirect(new URL(dashboardUrl, request.url))
      }

      // If accessing root with valid session, redirect to appropriate dashboard
      if (pathname === "/") {
        const dashboardUrl = `/${user.role}`
        return NextResponse.redirect(new URL(dashboardUrl, request.url))
      }
    } catch {
      // Invalid session, redirect to login
      if (!isPublicRoute && pathname !== "/") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
