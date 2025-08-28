"use server"
import dbConnect from "@/lib/db";
import CartModel from "@/models/cart"

export async function addMealToCart(mealId: number, quantity: number) {
    await dbConnect()
    console.log(`Adding meal ${mealId} with quantity ${quantity} to cart`)
    const cartData = await CartModel.create({
        userId: "1",
        items: [{ mealId, quantity }]
    });
    if (!cartData) {
        throw new Error("Failed to add meal to cart");
    }
    return { success: true  , message : "Meal added to cart successfully" };
}

// adding meals to DB 
// export async function addMealsToDB() {
//     await dbConnect()
//     await MealsModel.insertMany(meals)
// }