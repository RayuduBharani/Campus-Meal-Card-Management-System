import { getCartMeals } from "@/actions/meals";
import { requireRole } from "@/lib/auth"
import CardItemsPage from "./card-items";
import UserModel from "@/models/user";

export async function CartItems() {
    const user = await requireRole(["user", "manager", "admin"])
    const userData = await UserModel.findById(user.id)
    const cartItems = await getCartMeals(user.id);
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-800">
                        Balance: ₹{userData.money || 0}
                    </p>
                </div>
            </div>
            <CardItemsPage items={cartItems.items || []} userId={user.id} userBalance={user.money || 0} />
        </div>
    )
}
