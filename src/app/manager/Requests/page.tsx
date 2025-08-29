"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getRechargeRequests, handleRechargeRequest } from "@/actions/manager"
import { toast } from "sonner"

interface RechargeRequest {
  _id: string
  studentId: {
    _id: string
    name: string
    email: string
    money: number
  }
  money: number
  accept: boolean
  createdAt: string
}

type FilterStatus = 'all' | 'pending' | 'approved'
type SortType = 'date' | 'amount' | 'balance'

export default function ApproveRequests() {
  const [requests, setRequests] = useState<RechargeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [sortType, setSortType] = useState<SortType>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const data = await getRechargeRequests()
      setRequests(data)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load recharge requests")
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (requestId: string, approve: boolean) => {
    try {
      await handleRechargeRequest(requestId, approve)
      toast.success(approve ? "Request approved" : "Request rejected")
      // Refresh the requests list
      loadRequests()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to process request")
    }
  }

  const filteredRequests = requests.filter(request => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return !request.accept;
    return request.accept;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const multiplier = sortOrder === 'desc' ? -1 : 1;
    
    switch (sortType) {
      case 'amount':
        return (a.money - b.money) * multiplier;
      case 'balance':
        return (a.studentId.money - b.studentId.money) * multiplier;
      default: // 'date'
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return (dateB - dateA) * multiplier;
    }
  });

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-32">
          <div className="text-primary">Loading requests...</div>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(r => !r.accept).length;
  const approvedCount = requests.filter(r => r.accept).length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="w-24"
        >
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Recharge Requests</h1>
          <p className="text-gray-500">Manage student recharge requests</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4 bg-blue-50">
          <h3 className="text-sm font-medium text-blue-600">Total Requests</h3>
          <p className="text-2xl font-bold">{requests.length}</p>
          <p className="text-xs text-blue-600 mt-1">All time</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <h3 className="text-sm font-medium text-yellow-600">Pending</h3>
          <p className="text-2xl font-bold">{pendingCount}</p>
          <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <h3 className="text-sm font-medium text-green-600">Pending Amount</h3>
          <p className="text-2xl font-bold">₹{requests.filter(r => !r.accept).reduce((sum, r) => sum + r.money, 0)}</p>
          <p className="text-xs text-green-600 mt-1">Total pending recharges</p>
        </Card>
        <Card className="p-4 bg-purple-50">
          <h3 className="text-sm font-medium text-purple-600">Approved Today</h3>
          <p className="text-2xl font-bold">
            {requests.filter(r => 
              r.accept && 
              new Date(r.createdAt).toDateString() === new Date().toDateString()
            ).length}
          </p>
          <p className="text-xs text-purple-600 mt-1">Requests approved today</p>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? "default" : "outline"}
            onClick={() => setFilterStatus('all')}
          >
            All ({requests.length})
          </Button>
          <Button
            variant={filterStatus === 'pending' ? "default" : "outline"}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={filterStatus === 'approved' ? "default" : "outline"}
            onClick={() => setFilterStatus('approved')}
          >
            Approved ({approvedCount})
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortType === 'date' ? 'default' : 'outline'}
            onClick={() => setSortType('date')}
          >
            Sort by Date
          </Button>
          <Button
            variant={sortType === 'amount' ? 'default' : 'outline'}
            onClick={() => setSortType('amount')}
          >
            Sort by Amount
          </Button>
          <Button
            variant={sortType === 'balance' ? 'default' : 'outline'}
            onClick={() => setSortType('balance')}
          >
            Sort by Balance
          </Button>
          <Button
            variant="outline"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </Button>
        </div>
      </div>
      
      {filteredRequests.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          No {filterStatus !== 'all' ? filterStatus : ''} recharge requests found
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedRequests.map((request) => (
            <Card key={request._id} className={`p-4 ${!request.accept ? 'bg-yellow-50/50' : ''}`}>
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{request.studentId.name}</h3>
                    <p className="text-sm text-gray-500">{request.studentId.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    request.accept ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.accept ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="mt-3 flex justify-between items-baseline">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Balance</p>
                    <p className="text-lg font-semibold">₹{request.studentId.money}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Request Amount</p>
                    <p className="text-lg font-bold text-primary">+₹{request.money}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Requested on {new Date(request.createdAt).toLocaleString()}
                  </p>
                  {!request.accept && (
                    <p className="text-sm text-gray-600 mt-1">
                      New balance will be: ₹{request.studentId.money + request.money}
                    </p>
                  )}
                </div>
              </div>
              
              {!request.accept && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => handleRequest(request._id, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleRequest(request._id, false)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
