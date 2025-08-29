"use server"

import dbConnect from "@/lib/db";
import managerMoneyAcceptModel from "@/models/managerMoney";
import UserModel from "@/models/user"

export async function recharge(amount: number, userId: string) {
    try {
        if (!amount || amount <= 0) {
            throw new Error("Please enter a valid amount");
        }

        await dbConnect();
        
        const userdata = await UserModel.findById(userId);
        if (!userdata) {
            throw new Error("User not found");
        }

        // Create the recharge request
        const rechargeRequest = await managerMoneyAcceptModel.create({
            studentId: userId,
            money: amount
        });

        if (!rechargeRequest) {
            throw new Error("Failed to create recharge request");
        }

        return {
            success: true,
            message: "Recharge request sent successfully",
            requestId: rechargeRequest._id.toString()
        };
    } catch (error) {
        console.error('Recharge error:', error);
        throw new Error(error instanceof Error ? error.message : "Failed to process recharge request");
    }
}