import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const user = await requireRole(["admin"])

  return (
    <DashboardLayout user={user}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* System Administration */}
        <Card>
          <CardHeader>
            <CardTitle>System Administration</CardTitle>
            <CardDescription>Core system management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="default">
              User Management
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              System Settings
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Database Backup
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Security Logs
            </Button>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Server Status</span>
              <span className="font-medium text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="font-medium">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Backup</span>
              <span className="font-medium">2 hours ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>System audit log</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="font-medium">User Login</p>
              <p className="text-muted-foreground text-xs">manager@example.com - 2 min ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Settings Updated</p>
              <p className="text-muted-foreground text-xs">System timeout changed - 15 min ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Database Backup</p>
              <p className="text-muted-foreground text-xs">Completed successfully - 2 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">User Created</p>
              <p className="text-muted-foreground text-xs">New cashier account - 3 hours ago</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
