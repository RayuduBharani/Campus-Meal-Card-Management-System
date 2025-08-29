# 🥗 Campus Meal Card Management System

A modern, cashless meal management system for university canteens built with Next.js 13+, TypeScript, and MongoDB.

## 🎯 Project Overview

This system digitalizes university canteen transactions by implementing a meal card system where students can recharge their cards and make cashless payments for meals. The system supports multiple user roles and provides tailored dashboards for each role.

### Key Features

- 🔐 Role-based access control (Admin, Manager, Cashier, Student)
- 💳 Digital meal card management with MongoDB integration
- 💰 Real-time balance updates and recharge system
- 🍽️ Comprehensive meal management system
- 📊 Role-specific dashboards with real-time updates
- 🔄 Detailed transaction and order tracking
- 🍴 Menu management with categories
- 💼 Cashier order processing system

## 📝 Design Answers

### 1. Data Modeling

#### MongoDB Schema Design

**User Schema (`users` collection):**
```javascript
{
    name: String,          // Required: User's full name
    email: String,         // Required: Unique email identifier
    password: String,      // Required: Hashed password
    role: String,          // Required: "student"|"admin"|"manager"|"cashier"
    money: Number,         // Default: 0, Current balance
    timestamps: true       // Tracks createdAt and updatedAt
}
```

**Meals Schema (`meals` collection):**
```javascript
{
    name: String,          // Required: Name of the meal
    description: String,   // Required: Meal description
    price: Number,         // Required: Price > 0
    category: String,      // Required: Meal category
    image: String,         // Required: Image URL
    timestamps: true       // Tracks createdAt and updatedAt
}
```

**Orders Schema (`orders` collection):**
```javascript
{
    userId: ObjectId,      // Reference to users collection
    items: [{
        mealId: ObjectId, // Reference to meals collection
        quantity: Number, // Minimum: 1
        price: Number    // Price at time of order
    }],
    totalAmount: Number,   // Total order amount
    status: String,        // 'pending'|'completed'|'cancelled'
    paymentStatus: String, // 'pending'|'completed'
    cashierId: ObjectId,   // Reference to cashier who processed
    paymentDate: Date,     // When payment was processed
    orderDate: Date,       // When order was created
}
```

#### Transaction Recording

**Recharge Transactions (`ManagerMoneyAccept` collection):**
```javascript
{
    studentId: ObjectId,    // Reference to users collection
    accept: Boolean,        // Approval status
    money: Number,         // Recharge amount
    createdAt: Date,       // Transaction timestamp
    timestamps: true       // Tracks updates
}
```

**Cart Transactions (`Cart` collection):**
```javascript
{
    userId: ObjectId,      // Reference to users collection
    items: [{
        mealId: ObjectId, // Reference to meals collection
        quantity: Number  // Minimum: 1
    }],
    isActive: Boolean     // Cart status
}
```

**Order Transactions (`Order` collection):**
```javascript
{
    userId: ObjectId,      // Student who ordered
    items: [{
        mealId: ObjectId, // Meal reference
        quantity: Number, // Quantity ordered
        price: Number    // Price at time of order
    }],
    totalAmount: Number,   // Total cost
    status: String,        // Order status
    paymentStatus: String, // Payment status
    cashierId: ObjectId,   // Cashier who processed
    paymentDate: Date     // When paid
}
```

### 2. Edge Cases & Business Rules

#### Insufficient Balance Handling
- Real-time balance verification in user model
- Order creation blocked if balance insufficient
- Clear error messages displayed to students
- Direct redirection to recharge page
- Balance updates atomic with mongoose transactions

#### Preventing Double Transactions
- MongoDB atomic operations for balance updates
- Mongoose timestamps for tracking changes
- isActive flag in cart to prevent duplicates
- Status tracking in order model
- Frontend state management with React Context

#### Recharge Approval Process
Our system implements manager approval for recharges because:
- Dedicated manager approval model
- Direct student-manager linking
- Simple accept/reject workflow
- Automatic balance updates on approval
- Clear audit trail through timestamps

### 3. Dashboard Design

#### Admin Dashboard
Shows:
- Low Balance Alerts Counter
- Pending Orders Status
- Today's Orders Statistics (Completed/Total)
- System Operational Status
- Recent Transaction List with Details
  - User Information
  - Transaction Amount
  - Transaction Time

*Why?* Focuses on real-time monitoring and system health.

#### Manager Dashboard
Shows:
- Money Recharge Requests
- Request Amount Details
- Student Information
- Approval Actions
- Transaction History

*Why?* Streamlines the recharge approval process.

#### Cashier Dashboard
Shows:
- Pending Orders Queue
- Order Details with Items
- Payment Processing
- Order Status Updates
- Quick Actions

*Why?* Facilitates efficient order processing.

#### Student Dashboard
Shows:
- Current Balance
- Cart Management
- Available Meals
- Order History
- Recharge Request Options

*Why?* Essential features for daily meal purchases.

## 🛠️ Technical Stack

- **Frontend:** Next.js 13+, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes with App Router
- **Database:** MongoDB
- **Authentication:** JWT with Next.js Middleware
- **UI Components:** Shadcn UI
- **Image Storage:** URL-based image references
- **API Integration:** RESTful API endpoints

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RayuduBharani/Campus-Meal-Card-Management-System.git
```

2. Install dependencies:
```bash
cd Campus-Meal-Card-Management-System
npm install
```

3. Set up environment variables:
Create a .env file with:
```env
MONGODB_URI="your-mongodb-connection-string"
JWT_SECRET="your-jwt-secret"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

4. Ensure MongoDB is running:
Make sure you have MongoDB installed and running locally, or use MongoDB Atlas connection string in your .env file.

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## 🎥 Demo

[Link to demo video will be added]

## 📝 Assumptions Made

1. **Internet Connectivity:** Assumes stable internet connection for real-time transactions.
2. **Single Institution:** System is designed for a single university/institution.
3. **Operating Hours:** System operates 24/7 with maintenance windows.
4. **User Access:** All users have access to smart devices/computers.
5. **Data Privacy:** Complies with basic data protection regulations.

## 🎁 Implemented Features

- ✅ Complete meal management system
- ✅ Real-time balance tracking
- ✅ Role-based access control
- ✅ Order processing system
- ✅ Transaction history
- ✅ User authentication and authorization

## 📜 License

MIT

## 👥 Contributors

- Bharani Rayudu

## 📫 Contact

- Email: rayudubharani7288@gmail.com
- LinkedIn: [Bharani Rayudu](https://www.linkedin.com/in/rayudu-bharani/)
- GitHub: [RayuduBharani](https://github.com/RayuduBharani)
