import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import Meals from "./meals"
import { getMealsToDB } from "@/actions/meals"
// import { addMealsToDB } from "@/actions/meals"

export default async function UserMeals() {
  const user = await requireRole(["user"])
  const meals = await getMealsToDB();
  console.log(meals);
  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 px-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-primary">Campus Canteen Menu</h2>
          <p className="text-muted-foreground text-sm">
            Browse our delicious meals and add them to your cart.
          </p>
        </div>
        <Meals user={user} meals={meals}/>
      </div>
    </DashboardLayout>
  )
}
