# 🥗 Campus Meal Card Management System (CMCM)

A comprehensive meal card management system for university canteens, enabling cashless transactions for students and efficient management for staff.

## Author
- Name: Rayudu Bharani
- Email: rayudubharani7288@gmail.com

## Project Overview
The Campus Meal Card Management System (CMCM) is a modern, full-stack solution designed to digitize university canteen transactions. The system supports multiple user roles and provides tailored interfaces for administrators, staff members, and students.

## Core Features

### Role-Based Access
- 👨‍💼 **Admin Dashboard**: System-wide oversight and analytics
- 🏪 **Manager Interface**: Recharge approval and student activity monitoring
- 💳 **Cashier Portal**: Efficient transaction processing
- 👨‍� **Student Mobile Interface**: Balance management and transaction history

### Key Functionalities
- 💰 Secure card balance management
- 🔄 Recharge request and approval system
- 📊 Comprehensive transaction tracking
- 📱 Mobile-responsive student interface
- 🔒 Role-based authentication
- 📈 Real-time analytics and reporting

## Database Schema Design

### User Collections
```javascript
User {
  id: UUID,
  role: enum['ADMIN', 'MANAGER', 'CASHIER', 'STUDENT'],
  email: string,
  password: string,
  name: string,
  studentId?: string,  // for students only
  department?: string, // for students only
  staffId?: string,    // for staff only
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Card Collection
```javascript
Card {
  id: UUID,
  userId: UUID,
  balance: decimal,
  status: enum['ACTIVE', 'BLOCKED', 'EXPIRED'],
  lastUsed: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Transaction Collection
```javascript
Transaction {
  id: UUID,
  cardId: UUID,
  userId: UUID,
  type: enum['RECHARGE', 'PURCHASE'],
  amount: decimal,
  status: enum['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
  approvedBy?: UUID,  // for recharge transactions
  mealDetails?: {     // for purchase transactions
    items: array,
    quantity: number,
    price: decimal
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB or PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rayudubandaru/campus-meal-card-management.git
cd campus-meal-card-management
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # Next.js pages
│   ├── admin/        # Admin dashboard
│   ├── manager/      # Manager interface
│   ├── cashier/      # Cashier portal
│   ├── student/      # Student mobile interface
│   ├── api/          # API routes
│   └── auth/         # Authentication
├── components/       # Reusable components
│   ├── ui/          # shadcn components
│   ├── dashboard/   # Dashboard components
│   └── forms/       # Form components
├── lib/             # Utilities
│   ├── db/         # Database utilities
│   ├── auth/       # Auth utilities
│   └── api/        # API utilities
└── types/          # TypeScript types
```

## Design Decisions & Business Rules

### 1. Data Modeling Decisions

#### User Information Storage
- **Students**: ID, name, email, department, year, card details
- **Staff**: ID, name, email, role, department, permissions
- **Admin**: ID, name, email, role, access level

#### Card-Student Linking
- One-to-one relationship between students and cards
- Cards store balance, status, and transaction history
- Unique identifiers prevent duplicate cards

#### Transaction Recording
- Separate collections for recharges and purchases
- Timestamps and approval status for auditing
- Detailed meal information for purchases

### 2. Edge Cases & Solutions

#### Insufficient Balance
- Real-time balance checks before transaction approval
- Grace period option for small negative balances
- Automatic transaction rejection if below threshold

#### Duplicate Transactions
- Unique transaction IDs
- Timestamp-based locking mechanism
- Transaction status tracking

#### Recharge Approval Process
- Manual approval by managers for amounts above threshold
- Automatic approval for smaller amounts
- Email notifications for pending approvals

### 3. Dashboard Design Rationale

#### Admin View
- Total active users and cards
- Daily/weekly transaction volumes
- Popular meal times and items
- System health metrics

#### Manager View
- Pending recharge requests
- Daily transaction summary
- Student activity patterns
- Balance distribution

#### Cashier View
- Quick balance check
- Fast transaction entry
- Recent transaction history
- Peak hour alerts

## Bonus Features Implemented

1. 🍽️ **Interactive Meal Menu**
   - Categorized menu items
   - Real-time price updates
   - Popular items highlighting

2. 📊 **Advanced Analytics**
   - Weekly consumption patterns
   - Popular meal reports
   - Peak hour analysis

3. 📱 **QR Code Integration**
   - Unique QR codes per student
   - Quick scan-and-pay
   - Transaction verification

4. 🧪 **API Testing**
   - Jest for unit testing
   - Supertest for API testing
   - Mock data generation

5. 🐳 **Docker Support**
   - Containerized backend
   - MongoDB container
   - Docker Compose setup

## Theme Support

This project includes built-in support for light and dark modes using `next-themes`. The theme automatically syncs with system preferences and can be toggled manually.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
