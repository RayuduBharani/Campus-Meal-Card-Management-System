import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getStudentActivity } from "@/actions/manager"
import { Card } from "@/components/ui/card"

interface Meal {
  _id: string
  name: string
  price: number
  description: string
  category: string
  image: string
}

interface OrderItem {
  _id: string
  quantity: number
  mealId: Meal
  price: number
}

interface Order {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  items: OrderItem[]
  totalAmount: number
  orderDate: string
  status: 'pending' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'completed'
}

interface Recharge {
  _id: string
  studentId: {
    _id: string
    name: string
    email: string
  }
  money: number
  accept: boolean
  createdAt: string
}

export default async function ManagerDashboard() {
  const user = await requireRole(["manager"])
  const activity: { orders: Order[], recharges: Recharge[] } = await getStudentActivity()

  return (
    <DashboardLayout user={user}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          <a 
            href="/manager/Requests" 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            View Pending Requests
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="p-4 bg-blue-50">
            <h3 className="text-sm font-medium text-blue-600">Pending Recharges</h3>
            <p className="text-2xl font-bold">
              {activity.recharges.filter(r => !r.accept).length}
            </p>
          </Card>
          <Card className="p-4 bg-green-50">
            <h3 className="text-sm font-medium text-green-600">Today&apos;s Orders</h3>
            <p className="text-2xl font-bold">
              {activity.orders.filter(o => 
                new Date(o.orderDate).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </Card>
          <Card className="p-4 bg-purple-50">
            <h3 className="text-sm font-medium text-purple-600">Total Transactions</h3>
            <p className="text-2xl font-bold">
              {activity.orders.length + activity.recharges.length}
            </p>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Orders */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <span className="text-sm text-gray-500">Last {activity.orders.length} orders</span>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {activity.orders.map((order) => (
                <div key={order._id} className="border-b pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{order.userId.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{order.totalAmount}</p>
                      <p className="text-xs text-gray-500">{order.items.length} items</p>
                    </div>
                  </div>
                  <div className="mt-1 text-sm">
                    {order.items.map((item, index) => (
                      <span key={index} className="text-gray-600">
                        {item.quantity}x {item.mealId.name}
                        {index < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Recharges */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Recharges</h2>
              <span className="text-sm text-gray-500">Last {activity.recharges.length} requests</span>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {activity.recharges.map((recharge) => (
                <div key={recharge._id} className="border-b pb-2 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{recharge.studentId.name}</p>
                      <p className="text-sm text-gray-500">{recharge.studentId.email}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(recharge.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{recharge.money}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        recharge.accept ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {recharge.accept ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
