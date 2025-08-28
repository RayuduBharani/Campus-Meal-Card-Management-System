'use client'

import { loginByRoleAction } from "@/actions/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLogin() {
  const router = useRouter()
  const [error, setError] = useState<string>("")

  async function handleLogin() {
    const result = await loginByRoleAction("admin")
    if (result.error) {
      setError(result.error)
    } else if (result.redirect) {
      router.push(result.redirect)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <form action={handleLogin} className="space-y-4">
          <Button type="submit" size="lg" className="w-full py-6 text-lg">
            Login as Admin
          </Button>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
        </form>
        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Back to Main Login
          </Link>
        </div>
      </Card>
    </div>
  )
}
