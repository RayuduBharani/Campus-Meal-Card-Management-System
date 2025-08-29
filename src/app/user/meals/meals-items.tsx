/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { addMealToCart } from '@/actions/meals'
import { getCategoryColor } from '@/lib/utils'

export default function Meals({user , meals} :{user: {id: string, name: string, role: string} , meals: {
  _id : string,
  name: string,
  description: string,
  category: string,
  price: number,
  image: string
}[]}) {
  
  const [cartItems, setCartItems] = useState<Map<string, number>>(new Map())

  // Handle quantity change (+/-)
  const handleQuantityChange = (mealId: string, delta: number) => {
    setCartItems((prev) => {
      const newMap = new Map(prev);
      const currentQty = newMap.get(mealId) || 1;
      const newQty = Math.max(1, currentQty + delta); // Minimum = 1
      newMap.set(mealId, newQty);
      return newMap;
    });
  }

  // Add meal to cart
  const handleAddToCart = async(mealId: string) => {
    try {
      const quantity = cartItems.get(mealId) || 1;
      const result = await addMealToCart(mealId, quantity, user.id);
      setCartItems((prev) => {
        const newMap = new Map(prev);
        newMap.delete(mealId);
        return newMap;
      });
      // Show success message
      window.alert(result.message || "Item added to cart successfully!");
    } catch (error) {
      console.error('Error adding to cart:', error);
      window.alert("Failed to add item to cart. Please try again.");
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {meals.map((meal) => (
          <div key={meal._id} className="border-2 rounded-lg overflow-hidden bg-card border-border">
            <div className="relative overflow-hidden">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-32 object-cover transition-transform duration-300"
              />
              <Badge 
                variant="secondary"
                className={`absolute top-2 right-2 text-xs ${getCategoryColor(meal.category)}`}
              >
                {meal.category}
              </Badge>
            </div>
            
            <div className="p-3 space-y-2">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-medium text-sm text-foreground leading-tight line-clamp-1">
                    {meal.name}
                  </h3>
                  <span className="font-semibold text-sm text-primary whitespace-nowrap">
                    ₹{meal.price}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {meal.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center border rounded">
                  <Button
                    className="px-2 py-0 text-sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(meal._id, -1)}
                  >
                    -
                  </Button>
                  <span className="px-3 text-sm">{cartItems.get(meal._id) || 1}</span>
                  <Button
                    className="px-2 py-0 text-sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(meal._id, 1)}
                  >
                    +
                  </Button>
                </div>

                <Button 
                  className="h-7 text-xs"
                  variant="default"
                  onClick={() => handleAddToCart(meal._id)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
