# LMS (Loan Management System) - API Documentation

## Base URL
```
http://localhost:5000
```

## API Endpoints

### 🏠 Root
- **GET** `/`
  - Get API information and available endpoints

---

### 📊 Dashboard

#### Get Dashboard Statistics
- **GET** `/api/dashboard`
- **Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCustomers": 3,
      "totalLoanProducts": 4,
      "totalApplications": 5,
      "activeLoans": 2,
      "totalCollateralValue": 1500000,
      "totalDisbursed": 800000,
      "totalOutstanding": 735000
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

---

### 💳 Loan Products

#### Get All Loan Products
- **GET** `/api/loan-products`
- **Query Params:** `?status=ACTIVE` (optional)
- **Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [...]
}
```

#### Get Single Loan Product
- **GET** `/api/loan-products/:id`

#### Create Loan Product
- **POST** `/api/loan-products`
- **Body:**
```json
{
  "name": "Premium Loan",
  "description": "Premium loan product",
  "interestRate": 10.5,
  "maxLoanAmount": 10000000,
  "minLoanAmount": 500000,
  "maxTenure": 48,
  "processingFee": 1.5,
  "ltvRatio": 0.75,
  "status": "ACTIVE"
}
```

#### Update Loan Product
- **PUT** `/api/loan-products/:id`
- **Body:** (any fields to update)

#### Delete Loan Product
- **DELETE** `/api/loan-products/:id`

---

### 👥 Customers

#### Get All Customers
- **GET** `/api/customers`

#### Get Single Customer
- **GET** `/api/customers/:id`

#### Create Customer
- **POST** `/api/customers`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "panCard": "ABCDE1234F",
  "address": "123 Main St",
  "city": "Mumbai",
  "pincode": "400001"
}
```

#### Update Customer
- **PUT** `/api/customers/:id`

#### Delete Customer
- **DELETE** `/api/customers/:id`

---

### 📝 Loan Applications (MOST IMPORTANT - API for Fintech Companies)

#### Get All Loan Applications
- **GET** `/api/loan-applications`
- **Query Params:** 
  - `?status=SUBMITTED` (optional)
  - `?customerId=xxx` (optional)

#### Get Single Loan Application
- **GET** `/api/loan-applications/:id`

#### Create New Loan Application (IMPORTANT - External API)
- **POST** `/api/loan-applications`
- **Body:**
```json
{
  "customer": {
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91-9876543210",
    "panCard": "ABCDE1234F",
    "address": "123 MG Road",
    "city": "Mumbai",
    "pincode": "400001"
  },
  "loanProductId": "product-uuid-here",
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

#### Update Loan Application Status (Approve/Reject)
- **PUT** `/api/loan-applications/:id/status`
- **Body (Approve):**
```json
{
  "status": "APPROVED",
  "sanctionedAmount": 500000,
  "tenureMonths": 24
}
```
- **Body (Disburse):**
```json
{
  "status": "DISBURSED",
  "sanctionedAmount": 500000,
  "tenureMonths": 24
}
```
- **Body (Reject):**
```json
{
  "status": "REJECTED",
  "rejectionReason": "Insufficient collateral value"
}
```

#### Delete Loan Application
- **DELETE** `/api/loan-applications/:id`

---

### 💰 Loans (Ongoing)

#### Get All Loans
- **GET** `/api/loans`
- **Query Params:** `?status=ACTIVE` (optional)

#### Get Single Loan
- **GET** `/api/loans/:id`

#### Record Repayment
- **POST** `/api/loans/:id/repayment`
- **Body:**
```json
{
  "amount": 25000,
  "referenceNumber": "REP-12345",
  "notes": "EMI payment for January"
}
```

#### Update Loan Status
- **PUT** `/api/loans/:id/status`
- **Body:**
```json
{
  "status": "CLOSED"
}
```

---

### 🏦 Collaterals (Mutual Fund Management)

#### Get All Collaterals
- **GET** `/api/collaterals`
- **Query Params:**
  - `?status=PLEDGED` (optional)
  - `?loanApplicationId=xxx` (optional)

#### Get Collaterals by Application
- **GET** `/api/collaterals/application/:applicationId`

#### Get Single Collateral
- **GET** `/api/collaterals/:id`

#### Create Collateral
- **POST** `/api/collaterals`
- **Body:**
```json
{
  "loanApplicationId": "application-uuid-here",
  "fundName": "ICICI Prudential Bluechip Fund",
  "folioNumber": "ICI987654321",
  "units": 1500,
  "navPerUnit": 750.50
}
```

#### Update Collateral Status
- **PUT** `/api/collaterals/:id/status`
- **Body:**
```json
{
  "status": "RELEASED"
}
```

#### Delete Collateral
- **DELETE** `/api/collaterals/:id`

---

## Status Values

### Loan Product Status
- `ACTIVE`
- `INACTIVE`

### Loan Application Status
- `DRAFT`
- `SUBMITTED`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `DISBURSED`

### Loan Status
- `ACTIVE`
- `CLOSED`
- `DEFAULTED`

### Collateral Status
- `PLEDGED`
- `RELEASED`

### Transaction Type
- `DISBURSEMENT`
- `REPAYMENT`
- `INTEREST`

---

## Error Responses

All endpoints return error responses in this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (in development mode)"
}
```

---

## Notes

1. All monetary amounts are in INR
2. Interest rates are annual percentages
3. Tenure is in months
4. All IDs are UUIDs
5. Dates are in ISO 8601 format
6. The Create Loan Application API automatically creates customer if not exists
7. Collateral value is calculated as: units × navPerUnit
8. LTV (Loan-to-Value) ratio determines max loan amount based on collateral
