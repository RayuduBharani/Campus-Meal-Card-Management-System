import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MessCard({ balance = 0 }: { balance?: number }) {
  return (
    <Card className="w-[380px] bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Campus Mess Card</CardTitle>
        <div className="text-sm opacity-85">Student Meal Card</div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-6">
          <div className="flex flex-col gap-1">
            <div className="text-sm opacity-85">Current Balance</div>
            <div className="text-3xl font-bold">₹{balance.toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg tracking-widest opacity-85">**** **** **** 1234</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs opacity-85">VALID THRU</div>
              <div>12/25</div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-xs opacity-85">CARD HOLDER</div>
              <div>STUDENT NAME</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
