// manager will accect user payment request userschema

import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    accept : {
        type : Boolean,
        default : false
    },
    money : {
        type : Number,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const MODEL_NAME = "ManagerMoneyAccept";
const managerMoneyAcceptModel = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, managerSchema)
export default managerMoneyAcceptModel