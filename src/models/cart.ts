import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId , ref:"users", required: true },
  items: [
    {
      mealId: { type: mongoose.Schema.Types.ObjectId, ref: "meals", required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  isActive: { type: Boolean, default: true },
});
const CartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default CartModel;