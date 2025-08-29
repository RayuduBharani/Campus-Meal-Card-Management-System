import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getOrders, updateOrderStatus } from "@/actions/orders"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"

export default async function CashierOrders() {
  const user = await requireRole(["cashier"])
  const orders = (await getOrders()) as Order[]

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
      case 'completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }

  // Group orders by date
  const groupedOrders = orders.reduce((groups, order) => {
    const date = new Date(order.orderDate).toLocaleDateString()
    return {
      ...groups,
      [date]: [...(groups[date] || []), order]
    }
  }, {} as Record<string, Order[]>)

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Orders History</h1>
            <p className="text-muted-foreground mt-1">View and manage all orders</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={getStatusColor('pending')}>
              Pending
            </Badge>
            <Badge variant="outline" className={getStatusColor('completed')}>
              Completed
            </Badge>
            <Badge variant="outline" className={getStatusColor('cancelled')}>
              Cancelled
            </Badge>
          </div>
        </div>

        {Object.entries(groupedOrders).map(([date, orders]) => (
          <div key={date} className="space-y-4">
            <h2 className="text-xl font-semibold sticky top-0 bg-background py-2">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <Card key={order._id.toString()} className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{order.userId?.name}</h3>
                        <p className="text-sm text-muted-foreground">{order.userId?.email}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Order Items:</h4>
                      {order.items.map((item) => (
                        <div key={item._id.toString()} className="flex justify-between text-sm">
                          <span>{item.mealId?.name} × {item.quantity}</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total Amount:</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      {order.status === 'pending' && (
                        <>
                          <form action={async () => {
                            'use server'
                            await updateOrderStatus(order._id.toString(), 'completed')
                          }}>
                            <Button className="w-full" type="submit">
                              Complete Order
                            </Button>
                          </form>
                          <form action={async () => {
                            'use server'
                            await updateOrderStatus(order._id.toString(), 'cancelled')
                          }}>
                            <Button variant="outline" className="w-full" type="submit">
                              Cancel Order
                            </Button>
                          </form>
                        </>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Ordered: {new Date(order.orderDate).toLocaleTimeString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              No orders found
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
