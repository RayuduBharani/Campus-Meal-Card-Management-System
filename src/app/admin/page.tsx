import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdminDashboardStats } from "@/actions/admin"
import { Order } from "@/lib/types"
export default async function AdminDashboard() {
  const user = await requireRole(["admin"])
  const stats = await getAdminDashboardStats()

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Monitoring Dashboard */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-red-600 dark:text-red-400">Low Balance Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                {stats.studentStats.lowBalanceCount}
              </div>
              <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">Students need attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-yellow-600 dark:text-yellow-400">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.todayStats.pendingOrders}
              </div>
              <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80 mt-1">Need processing</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-green-600 dark:text-green-400">Today&apos;s Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {stats.todayStats.completedOrders} / {stats.todayStats.totalOrders}
              </div>
              <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">Completed / Total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-blue-600 dark:text-blue-400">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                Active
              </div>
              <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest completed orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.map((transaction: Order) => (
                  <div key={transaction._id.toString()} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {transaction.userId.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">{transaction.userId.name}</p>
                      <p className="text-xs text-muted-foreground">{transaction.userId.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(transaction.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.orderDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent transactions found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
