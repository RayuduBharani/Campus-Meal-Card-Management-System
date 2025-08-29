import { DashboardLayout } from '@/components/dashboard-layout'
import { requireRole } from '@/lib/auth'
import React from 'react'
import { CartItems } from './cart'

export default async function UserCart() {
  const user = await requireRole(["user", "manager", "admin"])
  return (
    <DashboardLayout user={user}>
      <CartItems />
    </DashboardLayout>
  )
}
