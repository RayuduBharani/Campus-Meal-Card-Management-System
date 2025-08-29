'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RemoveCardItem } from '@/actions/meals'
import { PlaceOrder } from '@/actions/meals'
import React from 'react'
import { toast } from 'sonner'

interface CartItem {
  _id: string
  mealId: {
    _id: string
    name: string
    price: number
    description: string
    image: string
  }
  quantity: number
}

interface CardItemsPageProps {
  items: CartItem[]
  userId: string
  userBalance: number
}

export default function CardItemsPage({ items = [], userId, userBalance }: CardItemsPageProps) {
  const [cartItems, setCartItems] = React.useState(items)
  const totalAmount = cartItems.reduce((total, item) => total + (item.mealId.price * item.quantity), 0)

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      const result = await RemoveCardItem(cartItemId, userId);
      
      if (result.success) {
        setCartItems(prev => prev.filter(item => item._id !== cartItemId));
        toast.success(result.message);
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove item from cart';
      toast.error(message);
    }
  }

  const handlePlaceOrder = async () => {
    try {
      const result = await PlaceOrder({ userId });
      
      if (result.success) {
        setCartItems([]);
        toast.success(result.message);
        toast('Please visit the cashier to complete your payment', {
          description: `Total amount: ₹${totalAmount}`,
          duration: 5000
        });
        // Reload the page to refresh the cart state
        window.location.reload();
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order';
      toast.error(message);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl">Your cart is empty</h2>
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cartItems.map((item) => (
          <Card key={item._id} className="p-4">
            <div className="space-y-2">
              <h3 className="font-bold">{item.mealId.name}</h3>
              <p className="text-sm text-gray-500">{item.mealId.description}</p>
              <div className="flex justify-between items-center">
                <p className="font-bold">₹{item.mealId.price * item.quantity}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => handleRemoveFromCart(item._id)}
                className="w-full"
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Total Amount:</h3>
          <p className="text-lg font-bold">₹{totalAmount}</p>
        </div>
        <Button 
          onClick={handlePlaceOrder}
          className="w-full"
          disabled={totalAmount === 0}
        >
          Place Order
        </Button>
      </div>
    </div>
  )
}
