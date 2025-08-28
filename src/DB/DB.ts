import mongoose from "mongoose"

let isConnected = false

export const DataBase = async () => {
    try {
        if (isConnected) {
            return
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI not found in environment variables")
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions

        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cmcm", options)
        isConnected = true
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        throw error
    }
}