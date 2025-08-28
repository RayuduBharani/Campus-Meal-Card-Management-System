/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { addMealToCart } from '@/actions/meals'
import { meals } from '@/lib/utils'
const getCategoryColor = (category: string) => {
  const colors = {
    "Main Course": "bg-primary/10 text-primary hover:bg-primary/20",
    "Breakfast": "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    "Beverages": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    "Desserts": "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
    "Bread": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
  }
  return colors[category as keyof typeof colors] || "bg-secondary/10 text-secondary hover:bg-secondary/20"
}

export default function Meals() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

  const handleQuantityChange = (mealId: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [mealId]: Math.max(1, (prev[mealId] || 1) + delta)
    }))
  }

  const handleAddToCart = async(mealId: number) => {
    const quantity = quantities[mealId] || 1
    // await addMealToCart(mealId, quantity)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {meals.map((meal) => (
          <div key={meal.id} className="border-2 rounded-lg overflow-hidden bg-card border-border">
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
                    onClick={() => handleQuantityChange(meal.id, -1)}
                  >
                    -
                  </Button>
                  <span className="px-3 text-sm">{quantities[meal.id] || 1}</span>
                  <Button
                    className="px-2 py-0 text-sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(meal.id, 1)}
                  >
                    +
                  </Button>
                </div>

                <Button 
                  className="h-7 text-xs"
                  variant="default"
                  onClick={() => handleAddToCart(meal.id)}
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
