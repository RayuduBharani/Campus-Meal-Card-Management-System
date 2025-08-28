import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export type UserRole = "admin" | "user" | "cashier" | "manager"

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

// Mock user database - in production, this would be a real database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "admin@example.com": {
    password: "password123",
    user: {
      id: "1",
      email: "admin@example.com",
      role: "admin",
      name: "Admin User",
    },
  },
  "user@example.com": {
    password: "password123",
    user: {
      id: "2",
      email: "user@example.com",
      role: "user",
      name: "Regular User",
    },
  },
  "cashier@example.com": {
    password: "password123",
    user: {
      id: "3",
      email: "cashier@example.com",
      role: "cashier",
      name: "John Cashier",
    },
  },
  "manager@example.com": {
    password: "password123",
    user: {
      id: "4",
      email: "manager@example.com",
      role: "manager",
      name: "Jane Manager",
    },
  },
}

export async function createSession(user: User) {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify(user)

  cookieStore.set("session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session) return null

    return JSON.parse(session.value) as User
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function requireAuth(): Promise<User> {
  const user = await getSession()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]): Promise<User> {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }
  return user
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const userRecord = MOCK_USERS[email.toLowerCase()]

  if (!userRecord || userRecord.password !== password) {
    return null
  }

  return userRecord.user
}
