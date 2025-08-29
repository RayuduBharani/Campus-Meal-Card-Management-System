import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataBase } from "@/DB/DB"
import UserModel from "@/models/user"
import type { User } from "@/lib/types"

export default async function UsersAdmin() {
  const user = await requireRole(["admin"])
  await DataBase()
  const users = await UserModel.find().sort({ role: 1, name: 1 }).lean() as unknown as User[]

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user._id.toString()}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{user.name}</CardTitle>
                <Badge>{user.role}</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{user.email}</span>
                  </div>
                  {user.role === 'student' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance</span>
                      <span className={user.money < 100 ? 'text-red-500' : ''}>
                        {formatCurrency(user.money)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
