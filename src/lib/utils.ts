import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const meals = [
  {
    id: 1,
    name: "Chicken Biryani",
    description: "Fragrant basmati rice cooked with tender chicken and aromatic spices",
    price: 120,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: 2,
    name: "Veg Thali",
    description: "Complete meal with rice, dal, 2 vegetables, roti, and dessert",
    price: 80,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: 3,
    name: "Masala Dosa",
    description: "Crispy rice crepe served with potato curry and chutneys",
    price: 50,
    category: "Breakfast",
    image : "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: 4,
    name: "Cold Coffee",
    description: "Refreshing cold coffee with ice cream",
    price: 40,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: 5,
    name: "Paneer Butter Masala",
    description: "Rich and creamy curry with cottage cheese",
    price: 100,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: 6,
    name: "Fruit Salad",
    description: "Fresh mixed fruits with honey dressing",
    price: 60,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: 7,
    name: "Butter Naan",
    description: "Soft bread brushed with butter and garlic",
    price: 30,
    category: "Bread",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=800&h=600"
  }
]

export const getCategoryColor = (category: string) => {
  const colors = {
    "Main Course": "bg-primary/10 text-primary hover:bg-primary/20",
    "Breakfast": "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    "Beverages": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    "Desserts": "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
    "Bread": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
  }
  return colors[category as keyof typeof colors] || "bg-secondary/10 text-secondary hover:bg-secondary/20"
}