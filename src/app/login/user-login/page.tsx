'use client'

import { LoginUserAction } from "@/actions/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function UserLogin() {
  const router = useRouter()
  const [error, setError] = useState<string>("")

  async function handleLogin(formData: FormData) {
    setError("") // Clear any previous errors
    const result = await LoginUserAction(formData)
    if (result.error) {
      setError(result.error)
    } else if (result.redirect) {
      router.push(result.redirect)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Student Login</h1>
        <form action={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <input type="hidden" name="role" value="user" />
          <Button type="submit" className="w-full">Login</Button>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
        </form>
        <div className="space-y-4 text-center">
          <div>
            <span className="text-sm text-gray-500">Don&apos;t have an account? </span>
            <Link href="/login/user-signup" className="text-sm text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div>
            <Link href="/login" className="text-sm text-primary hover:underline">
              Back to Main Login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
