import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function CashierDashboard() {
  const user = await requireRole(["cashier"])

  return (
    <DashboardLayout user={user}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common cashier tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="default">
              New Sale
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Process Return
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Check Price
            </Button>
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Stats</CardTitle>
            <CardDescription>Your performance today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transactions</span>
              <span className="font-medium">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Sales</span>
              <span className="font-medium">$2,847.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Returns</span>
              <span className="font-medium">3</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Last 5 transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Sale #1247</span>
              <span className="font-medium">$45.99</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sale #1246</span>
              <span className="font-medium">$12.50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Return #1245</span>
              <span className="font-medium text-red-500">-$23.99</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sale #1244</span>
              <span className="font-medium">$89.99</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sale #1243</span>
              <span className="font-medium">$156.75</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
