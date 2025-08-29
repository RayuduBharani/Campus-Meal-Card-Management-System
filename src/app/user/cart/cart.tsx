import { getCartMeals } from "@/actions/meals";
import { requireRole } from "@/lib/auth"
import CardItemsPage from "./card-items";

export async function CartItems() {
    const user = await requireRole(["user", "manager", "admin"])
    const cartItems = await getCartMeals(user.id);
    console.log(cartItems)
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-800">
                        Balance: ₹{user.money || 0} , {user.email}
                    </p>
                </div>
            </div>
            <CardItemsPage items={cartItems.items || []} userId={user.id} userBalance={user.money || 0} />
        </div>
    )
}
