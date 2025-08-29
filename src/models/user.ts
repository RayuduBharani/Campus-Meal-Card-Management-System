import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: "student",
        required: true
    },
    money : {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const MODEL_NAME = 'users';
const UserModel = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, userSchema);
export default UserModel;