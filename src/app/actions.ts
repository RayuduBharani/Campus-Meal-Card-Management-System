'use server'

import { DataBase } from "@/DB/DB";
import OrderModel from "@/models/orders";
import MealsModel from "@/models/meals";
import UserModel from "@/models/user";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

export async function processOrderAction(userId: string | Types.ObjectId, items: { mealId: string | Types.ObjectId, quantity: number }[]) {
    try {
        await DataBase();
        
        // Initialize models
        await Promise.all([
            UserModel.init(),
            MealsModel.init(),
            OrderModel.init()
        ]);
        
        // Calculate total amount and get meal details
        const meals = await Promise.all(
            items.map(async (item) => {
                const mealId = typeof item.mealId === 'string' ? new Types.ObjectId(item.mealId) : item.mealId;
                const meal = await MealsModel.findById(mealId);
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
        const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
        const user = await UserModel.findById(userObjectId);
        if (!user) throw new Error('User not found');
        if (user.money < totalAmount) {
            throw new Error('Insufficient balance');
        }

        // Create order
        const order = new OrderModel({
            userId: userObjectId,
            items: items.map((item, index) => ({
                mealId: typeof item.mealId === 'string' ? new Types.ObjectId(item.mealId) : item.mealId,
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
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error('Error processing order:', error);
        throw error;
    }
}

export async function searchUserAction(query: string) {
    try {
        await DataBase();
        await UserModel.init();

        const users = await UserModel.find({
            role: 'user',
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('name email money').lean();

        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Failed to search users');
    }
}
