-- CreateEnum
CREATE TYPE "LoanProductStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LoanApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DISBURSED');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'CLOSED', 'DEFAULTED');

-- CreateEnum
CREATE TYPE "CollateralStatus" AS ENUM ('PLEDGED', 'RELEASED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DISBURSEMENT', 'REPAYMENT', 'INTEREST');

-- CreateTable
CREATE TABLE "loan_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "maxLoanAmount" DOUBLE PRECISION NOT NULL,
    "minLoanAmount" DOUBLE PRECISION NOT NULL,
    "maxTenure" INTEGER NOT NULL,
    "processingFee" DOUBLE PRECISION NOT NULL,
    "ltvRatio" DOUBLE PRECISION NOT NULL,
    "status" "LoanProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "panCard" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "pincode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_applications" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "loanProductId" TEXT NOT NULL,
    "requestedAmount" DOUBLE PRECISION NOT NULL,
    "status" "LoanApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "sanctionedAmount" DOUBLE PRECISION NOT NULL,
    "disbursedAmount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "outstandingAmount" DOUBLE PRECISION NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaterals" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "folioNumber" TEXT NOT NULL,
    "units" DOUBLE PRECISION NOT NULL,
    "navPerUnit" DOUBLE PRECISION NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "pledgeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "CollateralStatus" NOT NULL DEFAULT 'PLEDGED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collaterals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_panCard_key" ON "customers"("panCard");

-- CreateIndex
CREATE UNIQUE INDEX "loans_loanApplicationId_key" ON "loans"("loanApplicationId");

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_loanProductId_fkey" FOREIGN KEY ("loanProductId") REFERENCES "loan_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaterals" ADD CONSTRAINT "collaterals_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
