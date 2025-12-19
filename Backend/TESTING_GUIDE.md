# API Testing Guide

## Server is running at: http://localhost:5000

### Quick Tests (Copy and paste in Postman or use curl):

## 1. Test Root Endpoint
GET http://localhost:5000

## 2. Get Dashboard Statistics
GET http://localhost:5000/api/dashboard

## 3. Get All Loan Products
GET http://localhost:5000/api/loan-products

## 4. Get All Customers
GET http://localhost:5000/api/customers

## 5. Get All Loan Applications
GET http://localhost:5000/api/loan-applications

## 6. Get All Ongoing Loans
GET http://localhost:5000/api/loans

## 7. Get All Collaterals
GET http://localhost:5000/api/collaterals

---

## Testing Create Loan Application (IMPORTANT API)

### Step 1: Get a Loan Product ID
GET http://localhost:5000/api/loan-products
(Copy one of the "id" values from the response)

### Step 2: Create Loan Application
POST http://localhost:5000/api/loan-applications
Content-Type: application/json

Body:
```json
{
  "customer": {
    "name": "API Test Customer",
    "email": "apitest@example.com",
    "phone": "+91-7777777777",
    "panCard": "APITEST123",
    "address": "API Test Address",
    "city": "Delhi",
    "pincode": "110001"
  },
  "loanProductId": "PASTE_PRODUCT_ID_HERE",
  "requestedAmount": 250000,
  "collaterals": [
    {
      "fundName": "API Test Mutual Fund",
      "folioNumber": "API123456789",
      "units": 600,
      "navPerUnit": 700
    }
  ]
}
```

### Step 3: Approve the Application
PUT http://localhost:5000/api/loan-applications/APPLICATION_ID/status
Content-Type: application/json

Body:
```json
{
  "status": "DISBURSED",
  "sanctionedAmount": 250000,
  "tenureMonths": 18
}
```

### Step 4: Check the new loan
GET http://localhost:5000/api/loans

### Step 5: Record a repayment
POST http://localhost:5000/api/loans/LOAN_ID/repayment
Content-Type: application/json

Body:
```json
{
  "amount": 15000,
  "referenceNumber": "TEST-REP-001",
  "notes": "Test EMI payment"
}
```

---

## All APIs are working! ✅

You can import the `postman_collection.json` file into Postman for easier testing.
