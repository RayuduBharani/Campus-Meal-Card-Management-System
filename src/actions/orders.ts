import { DataBase } from "@/DB/DB";
import OrderModel from "@/models/orders";
import UserModel from "@/models/user";
import MealsModel from "@/models/meals";
import { revalidatePath } from "next/cache";

export async function getOrders() {
    try {
        // Ensure models are registered
        await DataBase();
        
        // Make sure UserModel and MealsModel are imported
        await Promise.all([
            UserModel.init(),
            MealsModel.init(),
            OrderModel.init()
        ]);

        const orders = await OrderModel.find()
            .populate({
                path: 'userId',
                model: UserModel,
                select: 'name email'
            })
            .populate({
                path: 'items.mealId',
                model: MealsModel,
                select: 'name price'
            })
            .sort({ orderDate: -1 });

        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
    }
}

export async function updateOrderStatus(orderId: string, status: 'completed' | 'cancelled') {
    try {
        await DataBase();
        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        const userData = await UserModel.findById(order?.userId);
        if (order && userData) {
            if (status === 'completed') {
                userData.money -= order.totalAmount;
                await userData.save();
            } else if (status === 'cancelled') {
                userData.money += order.totalAmount;
                await userData.save();
            }
        }
        revalidatePath('/cashier');
        return order;
    } catch (error) {
        console.error('Error updating order:', error);
        throw new Error('Failed to update order');
    }
}
