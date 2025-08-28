import mongoose, { Model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "cashier" | "student";
  studentId?: string;
  employeeId?: string;
  cardBalance?: number;
  isActive: boolean;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'manager', 'cashier', 'student'], 
        required: true 
    },
    studentId: { 
        type: String, 
        sparse: true,
        unique: true
    },
    employeeId: { 
        type: String, 
        sparse: true,
        unique: true
    },
    cardBalance: { 
        type: Number, 
        default: 0,
        min: 0
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true
});

// Ensure either studentId or employeeId is present based on role
userSchema.pre('save', function(next) {
    if (this.role === 'student' && !this.studentId) {
        next(new Error('Student ID is required for student role'));
    } else if (['manager', 'cashier'].includes(this.role) && !this.employeeId) {
        next(new Error('Employee ID is required for staff roles'));
    } else {
        next();
    }
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default UserModel;