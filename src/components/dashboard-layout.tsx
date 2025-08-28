import type React from "react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/actions"
import type { User } from "@/lib/auth"
import Link from "next/link"

interface DashboardLayoutProps {
  user: User
  children: React.ReactNode
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const roleColors: Record<User['role'], string> = {
      cashier: "bg-blue-500",
      manager: "bg-purple-500",
      admin: "bg-red-500",
      user: "bg-green-500",
    }

  const roleIcons: Record<User['role'], string> = {
      cashier: "💰",
      manager: "👔",
      admin: "⚙️",
      user: "👨‍💼",
    }

  const getNavigationLinks = (role: string) => {
    const links = [{ href: `/${role}`, label: "Dashboard" }]

    if (role === "manager" || role === "admin" || role === "supervisor") {
      links.push({ href: "/reports", label: "Reports" })
    }

    if (role === "admin" || role === "manager") {
      links.push({ href: "/settings", label: "Settings" })
    }

    return links
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${roleColors[user.role]} flex items-center justify-center text-white text-lg`}
              >
                {roleIcons[user.role]}
              </div>
              <div>
                <h1 className="text-xl font-semibold capitalize">{user.role} Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-4">
              {getNavigationLinks(user.role).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <form action={logoutAction}>
            <Button variant="outline" type="submit">
              Logout
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
