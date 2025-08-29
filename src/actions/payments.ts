'use server'

import { DataBase } from "@/DB/DB";
import OrderModel from "@/models/orders";
import UserModel from "@/models/user";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

export async function acceptPayment(orderId: string, cashierId: string) {
    try {
        await DataBase();
        
        // Initialize models
        await Promise.all([
            UserModel.init(),
            OrderModel.init()
        ]);

        // Find the order and populate user data
        const order = await OrderModel.findById(orderId)
            .populate('userId');

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.paymentStatus === 'completed') {
            throw new Error('Payment already completed');
        }

        if (order.status === 'cancelled') {
            throw new Error('Cannot accept payment for cancelled order');
        }

        // Check user's balance
        const user = await UserModel.findById(order.userId._id);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.money < order.totalAmount) {
            // Instead of rejecting, mark the order as cancelled due to insufficient funds
            await OrderModel.findByIdAndUpdate(orderId, {
                status: 'cancelled',
                cashierId: new Types.ObjectId(cashierId),
                paymentStatus: 'pending'
            });
            throw new Error('Order cancelled: Insufficient balance');
        }

        // Process the payment
        const session = await OrderModel.startSession();
        session.startTransaction();

        try {
            // Update order status
            await OrderModel.findByIdAndUpdate(orderId, {
                status: 'completed',
                paymentStatus: 'completed',
                cashierId: new Types.ObjectId(cashierId),
                paymentDate: new Date()
            }, { session });

            // Deduct user's balance
            await UserModel.findByIdAndUpdate(
                order.userId._id,
                { $inc: { money: -order.totalAmount } },
                { session }
            );

            await session.commitTransaction();
            revalidatePath('/cashier');
            
            return {
                success: true,
                message: 'Payment accepted successfully'
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Error accepting payment:', error);
        throw error;
    }
}

export async function rejectPayment(orderId: string, cashierId: string) {
    try {
        await DataBase();
        await OrderModel.init();

        const order = await OrderModel.findByIdAndUpdate(orderId, {
            status: 'cancelled',
            cashierId: new Types.ObjectId(cashierId)
        });

        if (!order) {
            throw new Error('Order not found');
        }

        revalidatePath('/cashier');
        
        return {
            success: true,
            message: 'Order cancelled successfully'
        };
    } catch (error) {
        console.error('Error rejecting payment:', error);
        throw error;
    }
}
