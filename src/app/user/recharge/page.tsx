import { DashboardLayout } from '@/components/dashboard-layout'
import { requireRole } from '@/lib/auth'
import React from 'react'

export default async function UserReachage() {
  const user = await requireRole(["user", "manager", "admin"])
  return (
    <DashboardLayout user={user}>
      <div>reachare</div>
    </DashboardLayout>
  )
}
