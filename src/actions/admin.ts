'use server';

import { DataBase } from "@/DB/DB";
import UserModel from "@/models/user";
import OrderModel from "@/models/orders";
import type { AdminDashboardStats, Order } from "@/lib/types";

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
    try {
        await DataBase();

        // Get student stats with low balance focus
        // Get student stats with default values if no students found
        const studentAggregation = await UserModel.aggregate([
            { $match: { role: "student" } },
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    totalBalance: { $sum: "$money" },
                    lowBalanceCount: {
                        $sum: {
                            $cond: [{ $lt: ["$money", 100] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const studentData = studentAggregation[0] || {
            totalStudents: 0,
            totalBalance: 0,
            lowBalanceCount: 0
        };

        // Get today's monitoring stats
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Get today's monitoring stats with default values if no orders found
        const todayAggregation = await OrderModel.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    completedOrders: { 
                        $sum: { 
                            $cond: [
                                { $eq: ["$status", "completed"] }, 
                                1, 
                                0
                            ]
                        }
                    },
                    pendingOrders: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "pending"] },
                                1,
                                0
                            ]
                        }
                    },
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        const todayData = todayAggregation[0] || {
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            totalAmount: 0
        };





        // Get recent transactions
        const recentTransactions = await OrderModel.find({
            status: "completed",
            paymentStatus: "completed"
        })
            .sort({ orderDate: -1 })
            .limit(5)
            .populate('userId', 'name email')
            .populate('cashierId', 'name')
            .lean() as unknown as Order[];

        return {
            studentStats: {
                totalStudents: studentData.totalStudents,
                totalBalance: studentData.totalBalance,
                lowBalanceCount: studentData.lowBalanceCount
            },
            todayStats: {
                totalOrders: todayData.totalOrders,
                completedOrders: todayData.completedOrders,
                pendingOrders: todayData.pendingOrders,
                totalAmount: todayData.totalAmount
            },
            recentTransactions
        };
    } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
        throw new Error("Failed to fetch admin dashboard statistics");
    }
}
