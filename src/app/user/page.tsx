import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import UserModel from "@/models/user"
import OrderModel from "@/models/orders"
import { DataBase } from "@/DB/DB"
import { Order } from "@/lib/types"

export default async function UserDashboard() {
  const user = await requireRole(["user", "manager", "admin"])
  await DataBase();
  const userData = await UserModel.findById(user.id)
  
  // Fetch recent orders
  const recentOrders = await OrderModel.find({ userId: user.id })
    .sort({ orderDate: -1 })
    .limit(5)
    .populate('items.mealId')

  return (
    <DashboardLayout user={user}>
      <div className="grid gap-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your meal card and transactions all in one place.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Current Balance</span>
              <span className="text-2xl font-bold">₹{userData.money || 0}</span>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Order Meals</h3>
                <p className="text-sm text-muted-foreground">Browse and order from today&apos;s menu</p>
              </div>
              <Link href="/user/meals" className="mt-auto">
                <Button className="w-full">View Menu</Button>
              </Link>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Recharge Card</h3>
                <p className="text-sm text-muted-foreground">Add money to your meal card</p>
              </div>
              <Link href="/user/recharge" className="mt-auto">
                <Button className="w-full" variant="outline">Recharge Now</Button>
              </Link>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">View Cart</h3>
                <p className="text-sm text-muted-foreground">Check your selected items</p>
              </div>
              <Link href="/user/cart" className="mt-auto">
                <Button className="w-full" variant="outline">Open Cart</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                No recent orders to show
              </div>
            ) : (
              recentOrders.map((order: Order) => (
                <div key={order._id.toString()} className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <p className="font-medium">
                      Order #{order._id.toString().slice(-6)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()} • ₹{order.totalAmount}
                    </p>
                    <div className="flex gap-2">
                      {order.items.map((item, index) => (
                        <span key={index} className="text-sm text-muted-foreground">
                          {item.mealId.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Badge 
                    className={
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
