import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"

export default async function UserDashboard() {
  const user = await requireRole(["user", "manager", "admin"])

  return (
    <DashboardLayout user={user}>
      <h1>user dashboard</h1>
    </DashboardLayout>
  )
}
