import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    mealId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Meal", 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    price: { 
        type: Number, 
        required: true 
    }
});

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    items: [orderItemSchema],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    orderDate: { 
        type: Date, 
        default: Date.now 
    }
});

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default OrderModel;
