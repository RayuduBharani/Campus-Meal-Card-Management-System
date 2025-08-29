'use client'

import { recharge } from "@/actions/reacharge"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const PRESET_AMOUNTS = [100, 500, 1000, 2000]

export function RechargeForm({ userId }: { userId: string }) {
  const [amount, setAmount] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePresetClick = (value: number) => {
    setSelectedPreset(value)
    setAmount(value.toString())
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setAmount(value)
      setSelectedPreset(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const numericAmount = parseInt(amount)
      
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Please enter a valid amount")
      }

      const result = await recharge(numericAmount, userId)
      
      if (result.success) {
        toast.success(result.message)
        setAmount("")
        setSelectedPreset(null)
        router.refresh() // Refresh the page to update the balance
      } else {
        throw new Error("Failed to send recharge request")
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to send recharge request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Add Money</CardTitle>
        <CardDescription>Choose an amount to add to your mess card</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {PRESET_AMOUNTS.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant={selectedPreset === preset ? "default" : "outline"}
                className="w-full"
                onClick={() => handlePresetClick(preset)}
                disabled={loading}
              >
                ₹{preset}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Or enter custom amount</div>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-muted-foreground">₹</span>
              </div>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="pl-7"
                placeholder="Enter amount"
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!amount || parseInt(amount) <= 0 || loading}
          >
            {loading ? "Processing..." : `Add ₹${amount || "0"}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
