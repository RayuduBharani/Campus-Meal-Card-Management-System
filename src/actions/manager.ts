"use server"

import dbConnect from "@/lib/db";
// Import all models from the registry to ensure proper initialization
import { UserModel, OrderModel, managerMoneyAcceptModel } from "@/models";
import { requireRole } from "@/lib/auth";

export async function getRechargeRequests() {
    try {
        await requireRole(["manager"]);
        await dbConnect();
        
        // Get all requests and populate full student data
        const requests = await managerMoneyAcceptModel
            .find({})
            .populate({
                path: 'studentId',
                model: 'users',
                select: 'name email money'
            })
            .sort({ createdAt: -1 });

        // Convert to plain objects and handle date formatting
        return JSON.parse(JSON.stringify(requests));
    } catch (error) {
        console.error('Error fetching recharge requests:', error);
        throw new Error('Failed to fetch recharge requests');
    }
}

export async function handleRechargeRequest(requestId: string, approve: boolean) {
    await requireRole(["manager"]);
    await dbConnect();
    
    const request = await managerMoneyAcceptModel.findById(requestId);
    
    if (!request) {
        throw new Error("Request not found");
    }

    if (approve) {
        // Update user's balance
        await UserModel.findByIdAndUpdate(
            request.studentId,
            { $inc: { money: request.money } }
        );
        // Mark request as accepted
        request.accept = true;
        await request.save();
        return { success: true, message: "Recharge request approved" };
    } else {
        // Delete the rejected request
        await managerMoneyAcceptModel.findByIdAndDelete(requestId);
        return { success: true, message: "Recharge request rejected" };
    }
}

export async function getStudentActivity(userId?: string) {
    try {
        await requireRole(["manager"]);
        await dbConnect();
        
        const query = userId ? { userId } : {};
        const recentOrders = await OrderModel
            .find(query)
            .populate('userId', 'name email')
            .populate('items.mealId', 'name price')
            .sort({ orderDate: -1 })
            .limit(50);

        const rechargeRequests = await managerMoneyAcceptModel
            .find(userId ? { studentId: userId } : {})
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 })
            .limit(50);

        return {
            orders: recentOrders,
            recharges: rechargeRequests
        };
    } catch (error) {
        console.error('Error in getStudentActivity:', error);
        throw new Error('Failed to fetch student activity');
    }
}

