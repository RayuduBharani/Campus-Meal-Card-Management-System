import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: "2", required: true },
  items: [
    {
      mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});
const CartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default CartModel;