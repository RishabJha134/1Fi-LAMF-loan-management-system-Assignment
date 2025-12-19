# LMS Backend - Loan Management System for LAMF

> A complete backend system for managing Loans Against Mutual Funds (LAMF) with RESTful APIs

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database (Neon)
- **Prisma ORM** - Database ORM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Features

- ✅ Complete Loan Management System
- ✅ Mutual Fund Collateral Management
- ✅ Customer Management
- ✅ Loan Product Configuration
- ✅ Loan Application Processing
- ✅ Ongoing Loan Tracking
- ✅ Repayment Management
- ✅ Dashboard with Statistics
- ✅ RESTful API for Fintech Integration

## 🗄️ Database Schema

### Models
1. **LoanProduct** - Different loan schemes/products
2. **Customer** - Customer information
3. **LoanApplication** - Loan application lifecycle
4. **Loan** - Active/ongoing loans
5. **Collateral** - Mutual fund units pledged
6. **Transaction** - All financial transactions

### Relationships
- Customer → has many LoanApplications
- LoanProduct → has many LoanApplications
- LoanApplication → has one Loan (when approved)
- LoanApplication → has many Collaterals
- Loan → has many Transactions

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the Backend directory:
```env
DATABASE_URL="your_postgresql_connection_string"
PORT=5000
NODE_ENV=development
```

4. **Run Prisma migrations**
```bash
npm run prisma:migrate
```

5. **Seed the database**
```bash
npm run prisma:seed
```

6. **Start the server**
```bash
npm start
```

The server will run at `http://localhost:5000`

## 📡 API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Loan Products
- `GET /api/loan-products` - Get all loan products
- `GET /api/loan-products/:id` - Get single loan product
- `POST /api/loan-products` - Create loan product
- `PUT /api/loan-products/:id` - Update loan product
- `DELETE /api/loan-products/:id` - Delete loan product

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Loan Applications
- `GET /api/loan-applications` - Get all applications
- `GET /api/loan-applications/:id` - Get single application
- `POST /api/loan-applications` - Create new application ⭐ **Important for Fintech API**
- `PUT /api/loan-applications/:id/status` - Update status (approve/reject)
- `DELETE /api/loan-applications/:id` - Delete application

### Loans (Ongoing)
- `GET /api/loans` - Get all loans
- `GET /api/loans/:id` - Get single loan
- `POST /api/loans/:id/repayment` - Record repayment
- `PUT /api/loans/:id/status` - Update loan status

### Collaterals
- `GET /api/collaterals` - Get all collaterals
- `GET /api/collaterals/application/:applicationId` - Get collaterals by application
- `GET /api/collaterals/:id` - Get single collateral
- `POST /api/collaterals` - Create collateral
- `PUT /api/collaterals/:id/status` - Update collateral status
- `DELETE /api/collaterals/:id` - Delete collateral

## 📝 API Usage Example

### Creating a Loan Application (For Fintech Companies)

```bash
POST /api/loan-applications
Content-Type: application/json

{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "panCard": "ABCDE1234F",
    "address": "123 Main St",
    "city": "Mumbai",
    "pincode": "400001"
  },
  "loanProductId": "uuid-of-loan-product",
  "requestedAmount": 500000,
  "collaterals": [
    {
      "fundName": "HDFC Equity Fund - Direct Growth",
      "folioNumber": "HDC123456789",
      "units": 1200,
      "navPerUnit": 650.50
    }
  ]
}
```

### Response
```json
{
  "success": true,
  "message": "Loan application created successfully",
  "data": {
    "id": "application-uuid",
    "status": "SUBMITTED",
    "customer": {...},
    "loanProduct": {...},
    "collaterals": [...]
  }
}
```

## 📊 Seed Data

The database is pre-populated with:
- 4 Loan Products (different schemes)
- 3 Customers
- 5 Loan Applications (various statuses)
- 2 Active Loans
- 4 Collaterals (mutual fund units)
- 5 Transactions

## 🧪 Testing

### Using Postman
1. Import `postman_collection.json` into Postman
2. Test all endpoints
3. See `TESTING_GUIDE.md` for detailed testing instructions

### Using Prisma Studio
```bash
npm run prisma:studio
```
Opens a visual database browser at `http://localhost:5555`

## 📚 Available Scripts

```bash
npm start              # Start the server
npm run dev            # Start with nodemon (auto-reload)
npm run prisma:migrate # Run database migrations
npm run prisma:seed    # Seed database with initial data
npm run prisma:studio  # Open Prisma Studio
npm run prisma:generate # Generate Prisma Client
```

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host/db |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development/production |

## 📖 Documentation Files

- `API_DOCUMENTATION.md` - Complete API reference
- `TESTING_GUIDE.md` - Step-by-step testing guide
- `postman_collection.json` - Postman collection for API testing
- `prisma/schema.prisma` - Database schema

## 🏗️ Project Structure

```
Backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.js            # Seed data
│   └── migrations/        # Migration files
├── src/
│   ├── config/
│   │   └── prisma.js      # Prisma client configuration
│   ├── controllers/       # Business logic
│   │   ├── loanProduct.controller.js
│   │   ├── customer.controller.js
│   │   ├── loanApplication.controller.js
│   │   ├── loan.controller.js
│   │   ├── collateral.controller.js
│   │   └── dashboard.controller.js
│   ├── routes/            # API routes
│   │   ├── loanProduct.routes.js
│   │   ├── customer.routes.js
│   │   ├── loanApplication.routes.js
│   │   ├── loan.routes.js
│   │   ├── collateral.routes.js
│   │   └── dashboard.routes.js
│   └── server.js          # Express server
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔑 Key Business Logic

### LTV Ratio (Loan-to-Value)
- Determines maximum loan amount based on collateral value
- Example: 70% LTV means max loan = 70% of mutual fund value

### Loan Application Flow
1. Customer submits application with collateral
2. System validates requested amount against LTV ratio
3. Application goes through SUBMITTED → UNDER_REVIEW → APPROVED → DISBURSED
4. Once disbursed, loan becomes active
5. Customer makes repayments
6. When fully paid, loan is CLOSED and collaterals are RELEASED

### Collateral Management
- Mutual funds are pledged as collateral
- Value = Units × NAV per unit
- Status: PLEDGED (active) → RELEASED (loan closed)

## 🚨 Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## 🎯 Status Values

### Loan Application
- DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, DISBURSED

### Loan
- ACTIVE, CLOSED, DEFAULTED

### Collateral
- PLEDGED, RELEASED

### Transaction Type
- DISBURSEMENT, REPAYMENT, INTEREST

## 📞 Support

For questions or issues, please refer to:
- API Documentation: `API_DOCUMENTATION.md`
- Testing Guide: `TESTING_GUIDE.md`

---

**Built with ❤️ for 1Fi SDE Assignment**
