"use server"
import dbConnect from "@/lib/db";
import CartModel from "@/models/cart"
import MealsModel from "@/models/meals";
import OrderModel from "@/models/orders";
import UserModel from "@/models/user";

export const getMealsToDB = async () => {
    await dbConnect();
    const meals = await MealsModel.find().lean();
    return JSON.parse(JSON.stringify(meals));
}

export async function addMealToCart(mealId: string, quantity: number , userId : string) {
    try {
        await dbConnect();
        
        // Try to find an existing active cart
        const existingCart = await CartModel.findOne({ 
            userId: userId, 
            isActive: true 
        });
        
        let cartData;
        if (existingCart) {
            // Update existing cart
            existingCart.items.push({ mealId, quantity });
            cartData = await existingCart.save();
        } else {
            // Create new cart
            cartData = await CartModel.create({
                userId: userId,
                items: [{ mealId, quantity }],
                isActive: true
            });
        }

        if (!cartData) {
            throw new Error("Failed to add meal to cart");
        }

        console.log("Cart operation successful:", cartData); // Debug log
        return { success: true, message: "Meal added to cart successfully" };
    } catch (error) {
        console.error("Error in addMealToCart:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to add meal to cart");
    }
}


// getting all the meals in the meals collection 
export async function getMeals() {
    await dbConnect()
    const meals = await CartModel.find()
    return JSON.parse(JSON.stringify(meals));
}

interface CartItem {
    _id?: string;
    mealId: {
        _id?: string;
        name: string;
        price: number;
        description: string;
        image: string;
    };
    quantity: number;
}

interface Cart {
    items: CartItem[];
    userId: string;
    isActive: boolean;
}

// get all cart added meals 
export async function getCartMeals(userId: string) {
    await dbConnect();
    try {
        const cart = await CartModel.findOne<Cart>({ 
            userId: String(userId), 
            isActive: true 
        }).populate({
            path: 'items.mealId',
            model: 'Meal'  // Changed from 'meals' to 'Meal' to match the model name
        }).lean();

        if (!cart) {
            return { success: true, items: [] };
        }

        // Ensure we have valid cart items data
        const items = cart.items || [];
        
        // Serialize the data to avoid circular references and ensure proper structure
        const serializedItems = items.map((item: { _id: { toString: () => string }; mealId: { _id: { toString: () => string; }; name: string; price: number; description: string; image: string; }; quantity: number; }) => ({
            _id: item._id?.toString(),
            mealId: {
                _id: item.mealId?._id?.toString(),
                name: item.mealId?.name || '',
                price: item.mealId?.price || 0,
                description: item.mealId?.description || '',
                image: item.mealId?.image || ''
            },
            quantity: item.quantity || 0
        }));

        return { 
            success: true, 
            items: serializedItems
        };
    } catch (error) {
        console.error("Error fetching cart meals:", error);
        throw new Error("Failed to fetch cart meals");
    }
}

// remove items from cart
export async function RemoveCardItem(cartItemId: string, userId: string) {
    try {
        await dbConnect();
        
        // Find the user's active cart
        const cart = await CartModel.findOne({
            userId: userId,
            isActive: true
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        // Find the item index in the cart
        const itemIndex = cart.items.findIndex(
            (item: { _id: { toString: () => string } }) => item._id.toString() === cartItemId
        );

        if (itemIndex === -1) {
            throw new Error("Item not found in cart");
        }

        // Remove the item using MongoDB's $pull operator
        const result = await CartModel.updateOne(
            { _id: cart._id },
            { $pull: { items: { _id: cartItemId } } }
        );

        if (result.modifiedCount === 0) {
            throw new Error("Failed to remove item from cart");
        }

        return { success: true, message: "Item removed from cart" };
    } catch (error) {
        console.error("Error removing item from cart:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to remove item from cart");
    }
}

export async function PlaceOrder({ userId }: { userId: string }) {
    try {
        await dbConnect();

        // Find user's active cart
        const cart = await CartModel.findOne({ 
            userId: userId,
            isActive: true 
        }).populate('items.mealId');

        if (!cart || !cart.items.length) {
            throw new Error("No active cart found or cart is empty");
        }

        // Calculate total amount and prepare order items
        const orderItems = cart.items.map((item: { mealId: { _id: string; price: number; }; quantity: number; }) => ({
            mealId: item.mealId._id,
            quantity: item.quantity,
            price: item.mealId.price * item.quantity
        }));

        const totalAmount = orderItems.reduce((sum : number, item : { price: number }) => sum + item.price, 0);

        // Check user's wallet balance
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.money < totalAmount) {
            throw new Error("Insufficient balance in wallet");
        }

        // Create order
        const order = await OrderModel.create({
            userId: userId,
            items: orderItems,
            totalAmount: totalAmount,
            status: 'completed'
        });

        // Update user's wallet balance
        user.money -= totalAmount;
        await user.save();

        // Deactivate the cart
        cart.isActive = false;
        await cart.save();

        return { 
            success: true, 
            message: "Order placed successfully",
            orderId: order._id,
            totalAmount: totalAmount
        };
    } catch (error) {
        console.error("Error placing order:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to place order");
    }
}