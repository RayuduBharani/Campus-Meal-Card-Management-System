import { DashboardLayout } from '@/components/dashboard-layout'
import { requireRole } from '@/lib/auth'
import React from 'react'

export default async function UserCart() {
  const user = await requireRole(["user", "manager", "admin"])
  // const cartItems = await 
  return (
    <DashboardLayout user={user}>
      <div>cart</div>
    </DashboardLayout>
  )
}
