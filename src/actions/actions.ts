"use server"


import bcrypt from 'bcryptjs'
import UserModel from '@/models/user'
import { DataBase } from '@/DB/DB'
import { redirect } from "next/navigation"
import { authenticateUser, createSession, destroySession } from "../lib/auth"
import type { UserRole } from "../lib/auth"

export async function loginByRoleAction(role: UserRole) {
  'use server'
  
  const mockUsers = {
    admin: { id: "1", email: "admin@example.com", role: "admin" as UserRole, name: "Admin User" },
    user: { id: "2", email: "user@example.com", role: "user" as UserRole, name: "Regular User" },
    cashier: { id: "3", email: "cashier@example.com", role: "cashier" as UserRole, name: "John Cashier" },
    manager: { id: "4", email: "manager@example.com", role: "manager" as UserRole, name: "Jane Manager" },
  }

  const user = mockUsers[role]

  if (!user) {
    return { error: "Invalid role" }
  }

  try {
    await createSession(user)
    return { success: true, redirect: `/${role}` }
  } catch (error) {
    return { error: "Login failed. Please try again." }
  }
}

export async function registerAction(formData: FormData) {
  'use server'
  
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  
  if (!email || !password || !name || !role) {
    return { error: "All fields are required" }
  }

  try {
    // Connect to database
    await DataBase()

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create new user
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      money: 0
    })
    
    // Create session with user data
    const user = {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as UserRole,
      money: newUser.money
    }
    
    await createSession(user)
    return { success: true, redirect: "/user" }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: "Registration failed. Please try again." }
  }
}
export async function LoginUserAction(formData: FormData) {
  'use server'
  
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  if (!email || !password || !role) {
    return { error: "All fields are required" }
  }

  try {
    const user = await authenticateUser(email, password)

    if (!user) {
      return { error: "Invalid email or password" }
    }

    if (user.role !== role) {
      return { error: "Invalid role for this user" }
    }

    // Only set the session cookie after successful authentication
    await createSession(user)
    return { success: true, redirect: `/${user.role}` }
  } catch (_error) {
    return { error: "Authentication failed. Please try again." }
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  if (!email || !password || !role) {
    return { error: "All fields are required" }
  }

  const user = await authenticateUser(email, password)

  if (!user) {
    return { error: "Invalid credentials" }
  }

  if (user.role !== role) {
    return { error: "Role mismatch" }
  }

  await createSession(user)

  switch (user.role) {
    case "admin":
      redirect("/admin")
    case "user":
      redirect("/user")
    case "cashier":
      redirect("/cashier")
    case "manager":
      redirect("/manager")
    default:
      redirect("/dashboard")
  }
}

export async function logoutAction() {
  await destroySession()
  redirect("/login")
}
