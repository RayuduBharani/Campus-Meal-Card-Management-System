import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import bcrypt from 'bcryptjs'
import UserModel from '@/models/user'
import { DataBase } from '@/DB/DB'

export type UserRole = "admin" | "user" | "cashier" | "manager"

export interface User {
  money: number
  id: string
  email: string
  role: UserRole
  name: string
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
  try {
    // Connect to database
    await DataBase()

    // Find user by email
    const user = await UserModel.findOne({ email: email.toLowerCase() })
    if (!user) {
      return null
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return null
    }

    // Return user without password
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      money: user.money
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}
