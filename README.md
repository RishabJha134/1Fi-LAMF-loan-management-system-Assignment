# Loan Management System (LMS) - LAMF (Lending Against Mutual Funds)

A full-stack web application for managing loans against mutual funds for NBFC (Non-Banking Financial Company).

## 🚀 Tech Stack

### Backend
- **Node.js** (v16+)
- **Express.js** (4.18.2) - Web framework
- **Prisma ORM** (5.22.0) - Database ORM
- **PostgreSQL** - Database (Neon Cloud)
- **Nodemon** - Development server

### Frontend
- **React.js** (18.2.0) - UI library
- **Vite** (5.0.8) - Build tool
- **React Router DOM** (6.20.0) - Routing
- **Axios** (1.6.2) - HTTP client
- **Tailwind CSS** (3.4.0) - Styling

## 📊 Database Schema

### Models

#### 1. **LoanProduct**
```prisma
model LoanProduct {
  id              String   @id @default(uuid())
  name            String
  description     String?
  interestRate    Float
  maxLoanAmount   Float
  minLoanAmount   Float
  maxTenure       Int
  processingFee   Float
  ltvRatio        Float
  status          LoanProductStatus @default(ACTIVE)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### 2. **Customer**
```prisma
model Customer {
  id              String   @id @default(uuid())
  name            String
  email           String   @unique
  phone           String
  panCard         String   @unique
  address         String?
  city            String?
  pincode         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### 3. **LoanApplication**
```prisma
model LoanApplication {
  id                String   @id @default(uuid())
  customerId        String
  loanProductId     String
  requestedAmount   Float
  status            LoanApplicationStatus @default(SUBMITTED)
  applicationDate   DateTime @default(now())
  approvedDate      DateTime?
  rejectionReason   String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

#### 4. **Loan**
```prisma
model Loan {
  id                  String   @id @default(uuid())
  loanApplicationId   String   @unique
  disbursedAmount     Float
  outstandingAmount   Float
  interestRate        Float
  tenureMonths        Int
  startDate           DateTime @default(now())
  endDate             DateTime
  status              LoanStatus @default(ACTIVE)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

#### 5. **Collateral**
```prisma
model Collateral {
  id                  String   @id @default(uuid())
  loanApplicationId   String
  fundName            String
  folioNumber         String
  units               Float
  navPerUnit          Float
  totalValue          Float
  pledgeDate          DateTime @default(now())
  releaseDate         DateTime?
  status              CollateralStatus @default(PLEDGED)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

#### 6. **Transaction**
```prisma
model Transaction {
  id                String   @id @default(uuid())
  loanId            String
  type              TransactionType
  amount            Float
  transactionDate   DateTime @default(now())
  referenceNumber   String
  notes             String?
  createdAt         DateTime @default(now())
}
```

### Enums

```prisma
enum LoanProductStatus {
  ACTIVE
  INACTIVE
}

enum LoanApplicationStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
  DISBURSED
}

enum LoanStatus {
  ACTIVE
  CLOSED
  DEFAULTED
}

enum CollateralStatus {
  PLEDGED
  RELEASED
}

enum TransactionType {
  DISBURSEMENT
  REPAYMENT
  INTEREST_CHARGE
  PENALTY
}
```

### Entity Relationships

```
Customer (1) -----> (M) LoanApplication
LoanProduct (1) ---> (M) LoanApplication
LoanApplication (1) -> (1) Loan
LoanApplication (1) -> (M) Collateral
Loan (1) -----------> (M) Transaction
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (or Neon account)
- Git

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd FinTech
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
DATABASE_URL="your-postgresql-connection-string"
PORT=5000

# Run database migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd Client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

### 1. Dashboard
```
GET /dashboard
```
**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCustomers": 3,
      "totalLoanProducts": 4,
      "totalApplications": 5,
      "activeLoans": 2,
      "totalDisbursed": 1800000,
      "totalOutstanding": 1500000,
      "totalCollateralValue": 2500000
    },
    "applications": {
      "pending": 2,
      "approved": 1,
      "rejected": 1
    },
    "recentApplications": [...],
    "recentTransactions": [...]
  }
}
```

### 2. Loan Products

#### Get All Products
```
GET /loan-products
```

#### Create Product
```
POST /loan-products
Content-Type: application/json

{
  "name": "Premium Gold Loan",
  "description": "High-value mutual fund loan",
  "interestRate": 9.5,
  "maxLoanAmount": 5000000,
  "minLoanAmount": 100000,
  "maxTenure": 36,
  "processingFee": 1.5,
  "ltvRatio": 0.75,
  "status": "ACTIVE"
}
```

#### Update Product
```
PUT /loan-products/:id
```

#### Delete Product
```
DELETE /loan-products/:id
```

### 3. Customers

#### Get All Customers
```
GET /customers
```

#### Create Customer
```
POST /customers
Content-Type: application/json

{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "+91-9876543210",
  "panCard": "ABCDE1234F",
  "address": "123 MG Road",
  "city": "Mumbai",
  "pincode": "400001"
}
```

#### Get Customer by ID
```
GET /customers/:id
```

#### Update Customer
```
PUT /customers/:id
```

#### Delete Customer
```
DELETE /customers/:id
```

### 4. Loan Applications

#### Get All Applications
```
GET /loan-applications?status=SUBMITTED
```

#### Create Application
```
POST /loan-applications
Content-Type: application/json

{
  "customer": {
    "name": "Amit Shah",
    "email": "amit@example.com",
    "phone": "+91-9876543210",
    "panCard": "DEFGH5678I",
    "address": "456 Park Street",
    "city": "Delhi",
    "pincode": "110001"
  },
  "loanProductId": "product-uuid",
  "requestedAmount": 500000,
  "collaterals": [
    {
      "fundName": "HDFC Equity Fund",
      "folioNumber": "HDC123456",
      "units": 1000,
      "navPerUnit": 650.50,
      "totalValue": 650500
    }
  ]
}
```

#### Get Application by ID
```
GET /loan-applications/:id
```

#### Update Application Status
```
PUT /loan-applications/:id/status
Content-Type: application/json

{
  "status": "APPROVED",
  "sanctionedAmount": 450000,
  "tenureMonths": 24
}
```

#### Delete Application
```
DELETE /loan-applications/:id
```

### 5. Loans

#### Get All Loans
```
GET /loans?status=ACTIVE
```

#### Get Loan by ID
```
GET /loans/:id
```

#### Record Repayment
```
POST /loans/:id/repayment
Content-Type: application/json

{
  "amount": 50000,
  "referenceNumber": "REF123456",
  "notes": "EMI payment"
}
```

### 6. Collaterals

#### Get All Collaterals
```
GET /collaterals?status=PLEDGED
```

#### Get Collateral by ID
```
GET /collaterals/:id
```

#### Update Collateral Status
```
PUT /collaterals/:id/status
Content-Type: application/json

{
  "status": "RELEASED"
}
```

## 🎨 Features

### Dashboard
- Overview statistics (customers, loans, applications)
- Financial metrics (disbursed, outstanding, collateral value)
- Application status breakdown
- Recent applications and transactions

### Loan Product Management
- Create/Edit/Delete loan products
- Configure interest rates, LTV ratios, processing fees
- Set loan amount limits and tenure
- Activate/Deactivate products

### Customer Management
- Add new customers with KYC details (PAN, contact info)
- View customer loan history
- Update customer information

### Loan Application Processing
- 4-step application wizard:
  1. Customer details
  2. Loan selection and amount
  3. Collateral (mutual fund) details
  4. Review and submit
- Auto-calculation of collateral value
- LTV-based loan eligibility check
- Application status tracking

### Loan Management
- View active and closed loans
- Track disbursed amount and outstanding balance
- Repayment progress visualization
- Transaction history

### Collateral Management
- Mutual fund collateral tracking
- Pledge and release management
- Collateral value monitoring
- Status-wise filtering

## 📁 Project Structure

```
FinTech/
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.js              # Seed data
│   │   └── migrations/          # Migration files
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js        # Prisma client
│   │   ├── controllers/         # Business logic
│   │   │   ├── dashboardController.js
│   │   │   ├── loanProductController.js
│   │   │   ├── customerController.js
│   │   │   ├── loanApplicationController.js
│   │   │   ├── loanController.js
│   │   │   └── collateralController.js
│   │   ├── routes/              # API routes
│   │   │   ├── dashboard.js
│   │   │   ├── loanProduct.js
│   │   │   ├── customer.js
│   │   │   ├── loanApplication.js
│   │   │   ├── loan.js
│   │   │   └── collateral.js
│   │   └── server.js            # Express app
│   ├── .env                     # Environment variables
│   └── package.json
│
├── Client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable components
│   │   │   │   ├── Alert.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── PageHeader.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── Table.jsx
│   │   │   └── layout/
│   │   │       └── Navbar.jsx   # Navigation
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LoanProducts.jsx
│   │   │   ├── LoanApplications.jsx
│   │   │   ├── CreateLoanApplication.jsx
│   │   │   ├── OngoingLoans.jsx
│   │   │   └── CollateralManagement.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── utils/
│   │   │   └── formatters.js    # Utility functions
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── package.json
│
└── README.md                    # This file
```

## 🧪 Testing

### Using Postman

1. Import the Postman collection from `Backend/postman_collection.json`
2. Set base URL: `http://localhost:5000/api`
3. Test all endpoints

### Sample Test Flow

1. **Create Loan Product**
   ```
   POST /loan-products
   ```

2. **Create Loan Application**
   ```
   POST /loan-applications
   ```

3. **Approve Application** (Creates Loan & Disburses)
   ```
   PUT /loan-applications/:id/status
   Body: { "status": "DISBURSED", "sanctionedAmount": 450000, "tenureMonths": 24 }
   ```

4. **Record Repayment**
   ```
   POST /loans/:id/repayment
   ```

5. **Release Collateral** (After loan closure)
   ```
   PUT /collaterals/:id/status
   Body: { "status": "RELEASED" }
   ```

## 🔐 Environment Variables

### Backend `.env`
```
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
PORT=5000
```

## 🚢 Deployment

### Backend (Heroku/Railway/Render)
1. Set DATABASE_URL environment variable
2. Run migrations: `npx prisma migrate deploy`
3. Start server: `npm start`

### Frontend (Vercel/Netlify)
1. Set VITE_API_URL environment variable
2. Build: `npm run build`
3. Deploy `dist` folder

## 📝 License

MIT License

## 👨‍💻 Author

Developed as a technical assignment for NBFC Loan Management System

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For any queries or issues, please create an issue in the repository.

---

**Note**: This is a demonstration project for educational purposes. Ensure proper security measures (authentication, authorization, encryption) before using in production.
