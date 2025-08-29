import { DataBase } from "@/DB/DB";
import OrderModel from "@/models/orders";
import MealsModel from "@/models/meals";
import UserModel from "@/models/user";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

export async function getMeals() {
    try {
        await DataBase();
        const meals = await MealsModel.find().sort({ category: 1 });
        return meals;
    } catch (error) {
        console.error('Error fetching meals:', error);
        throw new Error('Failed to fetch meals');
    }
}

export async function processOrder(userId: string, items: { mealId: string, quantity: number }[]) {
    try {
        await DataBase();
        
        // Calculate total amount and get meal details
        const meals = await Promise.all(
            items.map(async (item) => {
                const meal = await MealsModel.findById(item.mealId);
                if (!meal) throw new Error(`Meal not found: ${item.mealId}`);
                return {
                    meal,
                    quantity: item.quantity,
                    price: meal.price * item.quantity
                };
            })
        );

        const totalAmount = meals.reduce((sum, item) => sum + item.price, 0);

        // Get user and check balance
        const user = await UserModel.findById(userId);
        if (!user) throw new Error('User not found');
        if (user.money < totalAmount) {
            throw new Error('Insufficient balance');
        }

        // Create order
        const order = new OrderModel({
            userId: new Types.ObjectId(userId),
            items: items.map((item, index) => ({
                mealId: new Types.ObjectId(item.mealId),
                quantity: item.quantity,
                price: meals[index].price
            })),
            totalAmount,
            status: 'completed'
        });

        // Deduct user balance
        user.money -= totalAmount;

        // Save everything in a transaction
        await Promise.all([
            order.save(),
            user.save()
        ]);

        revalidatePath('/cashier');
        return { success: true, order };
    } catch (error) {
        console.error('Error processing order:', error);
        throw error;
    }
}

export async function searchUser(query: string) {
    try {
        await DataBase();
        const users = await UserModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('name email money');
        return users;
    } catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Failed to search users');
    }
}
