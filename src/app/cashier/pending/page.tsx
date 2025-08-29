import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"
import { acceptPayment, rejectPayment } from "@/actions/payments"
import { getOrders } from "@/actions/orders"

export default async function PendingOrders() {
    const user = await requireRole(["cashier"])
    const allOrders = await getOrders() as Order[]
    const orders = allOrders.filter(order => order.status === 'pending')
    console.log(orders)

    const getStatusColor = (status: Order['paymentStatus']) => {
        return status === 'pending'
            ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
            : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
    }

    return (
        <DashboardLayout user={user}>
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Pending Orders</h1>
                        <p className="text-muted-foreground mt-1">Review and accept payments</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <Card key={order._id.toString()} className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{order.userId?.name}</h3>
                                        <p className="text-sm text-muted-foreground">{order.userId?.email}</p>
                                    </div>
                                    <Badge variant="outline" className={getStatusColor(order.paymentStatus)}>
                                        Payment {order.paymentStatus}
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

                                <div className="flex flex-col gap-2">
                                    <form action={async () => {
                                        'use server'
                                        await acceptPayment(order._id.toString(), user.id)
                                    }}>
                                        <Button className="w-full" type="submit">
                                            Accept Payment
                                        </Button>
                                    </form>
                                    <form action={async () => {
                                        'use server'
                                        await rejectPayment(order._id.toString(), user.id)
                                    }}>
                                        <Button variant="outline" className="w-full" type="submit">
                                            Reject Order
                                        </Button>
                                    </form>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    Ordered: {new Date(order.orderDate).toLocaleString()}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {orders.length === 0 && (
                    <Card className="p-6">
                        <div className="text-center text-muted-foreground">
                            No pending orders
                        </div>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
}
