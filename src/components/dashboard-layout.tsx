import type React from "react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/actions/actions"
import type { User } from "@/lib/auth"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

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

    if (role === "user") {
      links.push(
        { href: "/user/meals", label: "Meals" },
        { href: "/user/recharge", label: "Recharge" },
        { href: "/user/cart", label: "Cart" }
      )
    }

    if (role === "cashier") {
      links.push(
        { href: "/cashier/orders", label: "Orders" }
      )
    }

    if (role === "manager" || role === "admin" || role === "supervisor") {
      links.push({ href: "/reports", label: "Reports" })
    }

    if (role === "admin" || role === "manager") {
    }

    return links
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${roleColors[user.role]} flex items-center justify-center text-white text-lg`}
              >
                {roleIcons[user.role]}
              </div>
              <div>
                <h1 className="text-xl font-semibold capitalize">{user.role}</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {getNavigationLinks(user.role).map((link) => (
                    <NavigationMenuItem key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link href={link.href} className={navigationMenuTriggerStyle()}>
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-3 p-4">
                        {getNavigationLinks(user.role).map((link) => (
                          <li key={link.href}>
                            <NavigationMenuLink asChild>
                              <Link href={link.href} className={navigationMenuTriggerStyle()}>
                                {link.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <form action={logoutAction}>
              <Button type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
