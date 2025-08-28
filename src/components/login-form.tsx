"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loginByRoleAction } from "@/lib/actions"
import type { UserRole } from "@/lib/auth"

const roles: { value: UserRole; label: string; icon: string }[] = [
  { value: "admin", label: "Admin", icon: "⚙️" },
  { value: "user", label: "User", icon: "👤" },
  { value: "cashier", label: "Cashier", icon: "💰" },
  { value: "manager", label: "Manager", icon: "👔" },
]

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleRoleClick(role: UserRole) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginByRoleAction(role)
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription className="text-muted-foreground">Please sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {roles.slice(0, 2).map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => handleRoleClick(role.value)}
                disabled={isLoading}
                className="p-4 rounded-lg border-2 transition-all hover:bg-accent hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed border-border"
              >
                <div className="text-2xl mb-2">{role.icon}</div>
                <div className="text-sm font-medium">{role.label}</div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {roles.slice(2).map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => handleRoleClick(role.value)}
                disabled={isLoading}
                className="p-4 rounded-lg border-2 transition-all hover:bg-accent hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed border-border"
              >
                <div className="text-2xl mb-2">{role.icon}</div>
                <div className="text-sm font-medium">{role.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="text-sm text-destructive text-center">{error}</div>}

        {/* Loading indicator */}
        {isLoading && <div className="text-center text-sm text-muted-foreground">Signing in...</div>}

        {/* Sign Up Link */}
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account? <button className="text-green-600 hover:underline font-medium">Sign up</button>
        </div>
      </CardContent>
    </Card>
  )
}
