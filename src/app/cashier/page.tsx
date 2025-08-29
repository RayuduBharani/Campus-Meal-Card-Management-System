import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { getOrders } from "@/actions/orders"
import type { Order } from "@/lib/types"


export default async function CashierDashboard() {
  const user = await requireRole(["cashier"])
  
  let recentOrders: Order[] = [];
  try {
    recentOrders = await getOrders();
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }

  const today = new Date()
  
  // Calculate today's stats
  const todaysOrders = recentOrders.filter(order => {
    const orderDate = new Date(order.orderDate)
    return orderDate.toDateString() === today.toDateString()
  })
  
  const pendingOrders = recentOrders.filter(order => order.status === 'pending')
  
  const todayStats = {
    ordersCount: todaysOrders.length,
    totalAmount: todaysOrders.reduce((sum: number, order: Order) => sum + (order.totalAmount || 0), 0),
    pendingCount: pendingOrders.length,
    completedCount: todaysOrders.filter(order => order.status === 'completed').length
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Cashier Dashboard</h1>
          <p className="text-muted-foreground">Process orders and manage transactions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Today&apos;s Orders</span>
              <span className="text-2xl font-bold">{todayStats.ordersCount}</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold">₹{todayStats.totalAmount}</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Pending Orders</span>
              <span className="text-2xl font-bold">{todayStats.pendingCount}</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Completed Orders</span>
              <span className="text-2xl font-bold">{todayStats.completedCount}</span>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Pending Orders */}
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Pending Orders</h2>
                <Link href="/cashier/pending">
                  <Button variant="outline" size="sm">View All Pending</Button>
                </Link>
              </div>
              <Separator />
              <div className="space-y-4">
                {pendingOrders.slice(0, 5).map((order: Order) => (
                  <div key={order._id.toString()} className="flex justify-between items-center p-4 rounded-lg border">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.userId?.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          #{order._id.toString().slice(-6)}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.orderDate).toLocaleTimeString()} • ₹{order.totalAmount}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {order.items.map(item => `${item.mealId.name} × ${item.quantity}`).join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
                {pendingOrders.length === 0 && (
                  <div className="text-center p-4 text-muted-foreground">
                    No pending orders
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Right Column - Quick Actions & Recent Orders */}
          <div className="flex flex-col gap-6">
            <Card className="p-6">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Link href="/cashier/pending">
                    <Button variant="default" className="w-full justify-start h-auto py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="flex items-center">
                          <span className="mr-2">📋</span>
                          Pending Orders
                        </span>
                        <span className="text-xs text-muted-foreground">Process waiting orders</span>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/cashier/orders">
                    <Button variant="outline" className="w-full justify-start h-auto py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="flex items-center">
                          <span className="mr-2">�</span>
                          All Orders
                        </span>
                        <span className="text-xs text-muted-foreground">View order history</span>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/cashier/meals">
                    <Button variant="outline" className="w-full justify-start h-auto py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="flex items-center">
                          <span className="mr-2">🍽️</span>
                          Menu Items
                        </span>
                        <span className="text-xs text-muted-foreground">View available meals</span>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Recent Completed Orders */}
            <Card className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                  <Link href="/cashier/orders">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                <Separator />
                <div className="space-y-4">
                  {recentOrders.slice(0, 4).map((order: Order) => (
                    <div key={order._id.toString()} className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.userId?.name}</span>
                          <Badge 
                            variant={order.status === 'completed' ? 'default' : 
                                    order.status === 'cancelled' ? 'destructive' : 'secondary'}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.orderDate).toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="outline" className="ml-2">₹{order.totalAmount}</Badge>
                    </div>
                  ))}
                  {recentOrders.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No recent orders
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
