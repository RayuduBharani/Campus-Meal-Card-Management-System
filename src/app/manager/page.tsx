import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
export default async function ManagerDashboard() {
  const user = await requireRole(["manager"])

  return (
    <DashboardLayout user={user}>
      <div>

      </div>
    </DashboardLayout>
  )
}
