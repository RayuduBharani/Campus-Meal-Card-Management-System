import { Types } from 'mongoose';

export interface Meal {
    _id: string | Types.ObjectId;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
}

export interface OrderItem {
    _id: string | Types.ObjectId;
    mealId: Meal;
    quantity: number;
    price: number;
}

export interface User {
    _id: string | Types.ObjectId;
    name: string;
    email: string;
    money: number;
    role: 'admin' | 'user' | 'cashier' | 'manager';
}

export interface Order {
    _id: string | Types.ObjectId;
    userId: User;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'completed';
    cashierId?: User;
    paymentDate?: Date;
    orderDate: Date;
}
