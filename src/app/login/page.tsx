import { getSession } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const user = await getSession()

  if (user) {
    redirect(`/${user.role}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Welcome to Campus Meal Card Management</h1>
        <div className="space-y-4">
          <Link href="/login/user-login" className="w-full block">
            <Button variant="outline" className="w-full text-lg py-6">
              Student Login
            </Button>
          </Link>
          <Link href="/login/admin-login" className="w-full block">
            <Button variant="outline" className="w-full text-lg py-6">
              Admin Login
            </Button>
          </Link>
          <Link href="/login/cashier-login" className="w-full block">
            <Button variant="outline" className="w-full text-lg py-6">
              Cashier Login
            </Button>
          </Link>
          <Link href="/login/manager-login" className="w-full block">
            <Button variant="outline" className="w-full text-lg py-6">
              Manager Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
