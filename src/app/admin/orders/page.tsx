import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getOrders } from "@/actions/orders"
import type { Order } from "@/lib/types"

export default async function OrdersAdmin() {
  const user = await requireRole(["admin"])
  const orders = await getOrders() as Order[]

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order._id.toString()}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Order #{order._id.toString().slice(-6)}</CardTitle>
                <Badge 
                  variant={
                    order.status === 'completed' ? 'default' : 
                    order.status === 'pending' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer</span>
                    <span>{order.userId.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{formatDate(order.orderDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
