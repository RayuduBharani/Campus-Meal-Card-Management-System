import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMeals } from "@/actions/meals"
import Image from "next/image"

interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

type MealsByCategory = {
  [key: string]: Meal[];
}

export default async function MealMenu() {
  const meals = await getMeals() as Meal[];
  
  // Group meals by category
  const mealsByCategory = meals.reduce<MealsByCategory>((acc, meal) => {
    if (!acc[meal.category]) {
      acc[meal.category] = [];
    }
    acc[meal.category].push(meal);
    return acc;
  }, {});

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary">Meal Menu</h1>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            size="lg"
          >
            Add New Meal
          </Button>
        </div>

        <div className="space-y-8">
          {Object.entries(mealsByCategory).map(([category, items]: [string, Meal[]]) => (
            <Card 
              key={category} 
              className="bg-card border shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="border-b bg-muted/50">
                <CardTitle className="text-2xl font-semibold text-secondary">
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item: Meal) => (
                    <li 
                      key={item._id} 
                      className="group flex flex-col rounded-lg border bg-card hover:bg-muted/50 transition-all duration-200 overflow-hidden"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex-1 mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary text-lg font-bold">
                            ₹{item.price.toFixed(2)}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
