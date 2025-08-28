import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function ManagerDashboard() {
  const user = await requireRole(["manager"])

  return (
    <DashboardLayout user={user}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Management Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Management Tools</CardTitle>
            <CardDescription>Store management functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="default">
              Staff Schedule
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Inventory Report
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Sales Analytics
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Staff Performance
            </Button>
          </CardContent>
        </Card>

        {/* Store Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Store Overview</CardTitle>
            <CardDescription>Today's store metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Sales</span>
              <span className="font-medium">$12,847.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transactions</span>
              <span className="font-medium">234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Staff On Duty</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Returns</span>
              <span className="font-medium">12</span>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
              <p className="text-xs text-yellow-600">5 items below minimum threshold</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Schedule Review</p>
              <p className="text-xs text-blue-600">Next week's schedule needs approval</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800">Sales Target</p>
              <p className="text-xs text-green-600">85% of monthly target achieved</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
