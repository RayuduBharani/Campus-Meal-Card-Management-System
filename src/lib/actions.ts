"use server"

import { redirect } from "next/navigation"
import { authenticateUser, createSession, destroySession } from "./auth"
import type { UserRole } from "./auth"

export async function loginByRoleAction(role: UserRole) {
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

  await createSession(user)

  switch (role) {
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
