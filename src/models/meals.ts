import mongoose from "mongoose";

const mealsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true
});
const MealsModel = mongoose.models.Meal || mongoose.model("Meal", mealsSchema);
export default MealsModel;