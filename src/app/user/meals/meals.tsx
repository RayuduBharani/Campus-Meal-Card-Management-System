import React from 'react'
import MealsItems from './meals-items'

export default function Meals({ user, meals }: { 
  user: { id: string; name: string; role: string; }; 
  meals: Array<{
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
  }>;
}) {
  return (
    <div className="min-h-screen bg-background p-6">
      <MealsItems user={user} meals={meals} />
    </div>
  )
}
