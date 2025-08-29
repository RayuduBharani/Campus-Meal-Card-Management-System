import { getSession } from "@/lib/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function LoginPage() {
  const user = await getSession()

  if (user) {
    redirect(`/${user.role}`)
  }

  const loginOptions = [
    { href: "/login/user-login", label: "Student Login", icon: "👨‍🎓" },
    { href: "/login/admin-login", label: "Admin Login", icon: "👨‍💼" },
    { href: "/login/cashier-login", label: "Cashier Login", icon: "💳" },
    { href: "/login/manager-login", label: "Manager Login", icon: "👨‍💻" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center space-y-4 pb-6 pt-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Welcome to Campus Meal Card
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Choose your role to continue
            </p>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="grid gap-4">
            {loginOptions.map((option) => (
              <Link key={option.href} href={option.href} className="block">
                <Button
                  variant="outline"
                  className="w-full text-lg py-6 bg-background/50 hover:bg-accent hover:text-accent-foreground group relative overflow-hidden border-border/50"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-background to-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="mr-3 text-2xl group-hover:scale-125 transition-transform relative z-10">
                    {option.icon}
                  </span>
                  <span className="font-medium relative z-10">{option.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
