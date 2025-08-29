import { DashboardLayout } from '@/components/dashboard-layout'
import { MessCard } from '@/components/mess-card'
import { RechargeForm } from '@/components/recharge-form'
import { requireRole } from '@/lib/auth'
import dbConnect from '@/lib/db'
import UserModel from '@/models/user'
import React from 'react'

export default async function UserRecharge() {
  try {
    await dbConnect()
    const user = await requireRole(["user", "manager", "admin"])
    
    const userData = await UserModel.findById(user.id)
    if (!userData) {
      throw new Error("User data not found")
    }

    // Create a completely serialized plain object matching the User type
    const pageData = {
      user: {
        id: user.id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
        money: Number(userData.money || 0)
      },
      balance: Number(userData.money || 0)
    }

    // Ensure everything is serialized by converting to and from JSON
    const serializedData = JSON.parse(JSON.stringify(pageData))

    return (
      <DashboardLayout user={serializedData.user}>
        <div className="flex flex-col items-center gap-8 p-8">
          <h1 className="text-2xl font-bold">Recharge Your Mess Card</h1>
          <div className="flex flex-col gap-6 items-center">
            <MessCard balance={serializedData.balance} />
            <RechargeForm userId={serializedData.user.id} />
          </div>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error('Error in UserRecharge:', error)
    throw error
  }
}
