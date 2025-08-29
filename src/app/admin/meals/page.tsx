import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMeals } from "@/actions/meals"
import type { Meal } from "@/lib/types"

export default async function MealsAdmin() {
  const user = await requireRole(["admin"])
  const meals = await getMeals() as Meal[]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Meals</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <Card key={meal._id.toString()}>
              <CardHeader>
                <CardTitle>{meal.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{meal.price}</p>
                <p className="text-muted-foreground">{meal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
