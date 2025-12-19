import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.collateral.deleteMany();
  await prisma.loanApplication.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.loanProduct.deleteMany();

  // Seed Loan Products
  console.log('Creating loan products...');
  const loanProducts = await prisma.loanProduct.createMany({
    data: [
      {
        name: 'Personal Loan - Standard',
        description: 'Standard personal loan against mutual funds with competitive interest rates',
        interestRate: 12.5,
        maxLoanAmount: 5000000,
        minLoanAmount: 50000,
        maxTenure: 36,
        processingFee: 2,
        ltvRatio: 0.70,
        status: 'ACTIVE'
      },
      {
        name: 'Personal Loan - Premium',
        description: 'Premium loan product for high-value mutual fund portfolios',
        interestRate: 10.5,
        maxLoanAmount: 10000000,
        minLoanAmount: 500000,
        maxTenure: 48,
        processingFee: 1.5,
        ltvRatio: 0.75,
        status: 'ACTIVE'
      },
      {
        name: 'Quick Loan - Express',
        description: 'Fast disbursement loan with higher interest rate',
        interestRate: 14,
        maxLoanAmount: 2000000,
        minLoanAmount: 25000,
        maxTenure: 24,
        processingFee: 2.5,
        ltvRatio: 0.65,
        status: 'ACTIVE'
      },
      {
        name: 'Business Loan - LAMF',
        description: 'Business loan secured by mutual fund units',
        interestRate: 11.5,
        maxLoanAmount: 15000000,
        minLoanAmount: 1000000,
        maxTenure: 60,
        processingFee: 2,
        ltvRatio: 0.70,
        status: 'ACTIVE'
      }
    ]
  });
  console.log(`✅ Created ${loanProducts.count} loan products`);

  // Seed Customers
  console.log('Creating customers...');
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91-9876543210',
      panCard: 'ABCDE1234F',
      address: '123, MG Road',
      city: 'Mumbai',
      pincode: '400001'
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91-9876543211',
      panCard: 'BCDEF2345G',
      address: '456, Park Street',
      city: 'Bangalore',
      pincode: '560001'
    }
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91-9876543212',
      panCard: 'CDEFG3456H',
      address: '789, Ring Road',
      city: 'Delhi',
      pincode: '110001'
    }
  });

  console.log(`✅ Created 3 customers`);

  // Get loan products for applications
  const products = await prisma.loanProduct.findMany();

  // Seed Loan Applications with Collaterals
  console.log('Creating loan applications with collaterals...');
  
  // Application 1 - APPROVED and converted to Loan
  const app1 = await prisma.loanApplication.create({
    data: {
      customerId: customer1.id,
      loanProductId: products[0].id,
      requestedAmount: 500000,
      status: 'DISBURSED',
      applicationDate: new Date('2024-01-15'),
      approvalDate: new Date('2024-01-20'),
      collaterals: {
        create: [
          {
            fundName: 'HDFC Equity Fund - Direct Growth',
            folioNumber: 'HDC123456789',
            units: 1200,
            navPerUnit: 650.50,
            totalValue: 780600,
            pledgeDate: new Date('2024-01-15'),
            status: 'PLEDGED'
          }
        ]
      }
    }
  });

  // Create active loan for application 1
  const loan1 = await prisma.loan.create({
    data: {
      loanApplicationId: app1.id,
      sanctionedAmount: 500000,
      disbursedAmount: 500000,
      interestRate: 12.5,
      tenureMonths: 24,
      startDate: new Date('2024-01-22'),
      endDate: new Date('2026-01-22'),
      outstandingAmount: 450000,
      status: 'ACTIVE',
      transactions: {
        create: [
          {
            type: 'DISBURSEMENT',
            amount: 500000,
            transactionDate: new Date('2024-01-22'),
            referenceNumber: 'DISB-20240122-001',
            notes: 'Loan disbursed successfully'
          },
          {
            type: 'REPAYMENT',
            amount: 30000,
            transactionDate: new Date('2024-02-22'),
            referenceNumber: 'REP-20240222-001',
            notes: 'EMI payment - Month 1'
          },
          {
            type: 'REPAYMENT',
            amount: 20000,
            transactionDate: new Date('2024-03-22'),
            referenceNumber: 'REP-20240322-001',
            notes: 'Partial payment - Month 2'
          }
        ]
      }
    }
  });

  // Application 2 - UNDER_REVIEW
  const app2 = await prisma.loanApplication.create({
    data: {
      customerId: customer2.id,
      loanProductId: products[1].id,
      requestedAmount: 1000000,
      status: 'UNDER_REVIEW',
      applicationDate: new Date('2024-12-10'),
      collaterals: {
        create: [
          {
            fundName: 'ICICI Bluechip Fund - Direct Growth',
            folioNumber: 'ICI987654321',
            units: 2000,
            navPerUnit: 750.25,
            totalValue: 1500500,
            pledgeDate: new Date('2024-12-10'),
            status: 'PLEDGED'
          }
        ]
      }
    }
  });

  // Application 3 - APPROVED and converted to Loan
  const app3 = await prisma.loanApplication.create({
    data: {
      customerId: customer3.id,
      loanProductId: products[2].id,
      requestedAmount: 300000,
      status: 'DISBURSED',
      applicationDate: new Date('2024-11-01'),
      approvalDate: new Date('2024-11-05'),
      collaterals: {
        create: [
          {
            fundName: 'SBI Large Cap Fund - Direct Growth',
            folioNumber: 'SBI456789123',
            units: 800,
            navPerUnit: 580.75,
            totalValue: 464600,
            pledgeDate: new Date('2024-11-01'),
            status: 'PLEDGED'
          }
        ]
      }
    }
  });

  const loan2 = await prisma.loan.create({
    data: {
      loanApplicationId: app3.id,
      sanctionedAmount: 300000,
      disbursedAmount: 300000,
      interestRate: 14,
      tenureMonths: 18,
      startDate: new Date('2024-11-06'),
      endDate: new Date('2026-05-06'),
      outstandingAmount: 285000,
      status: 'ACTIVE',
      transactions: {
        create: [
          {
            type: 'DISBURSEMENT',
            amount: 300000,
            transactionDate: new Date('2024-11-06'),
            referenceNumber: 'DISB-20241106-002',
            notes: 'Quick loan disbursed'
          },
          {
            type: 'REPAYMENT',
            amount: 15000,
            transactionDate: new Date('2024-12-06'),
            referenceNumber: 'REP-20241206-002',
            notes: 'EMI payment - Month 1'
          }
        ]
      }
    }
  });

  // Application 4 - SUBMITTED (Pending Review)
  const app4 = await prisma.loanApplication.create({
    data: {
      customerId: customer1.id,
      loanProductId: products[3].id,
      requestedAmount: 2000000,
      status: 'SUBMITTED',
      applicationDate: new Date('2024-12-18'),
      collaterals: {
        create: [
          {
            fundName: 'Axis Midcap Fund - Direct Growth',
            folioNumber: 'AXS789123456',
            units: 3000,
            navPerUnit: 980.50,
            totalValue: 2941500,
            pledgeDate: new Date('2024-12-18'),
            status: 'PLEDGED'
          }
        ]
      }
    }
  });

  // Application 5 - REJECTED
  const app5 = await prisma.loanApplication.create({
    data: {
      customerId: customer2.id,
      loanProductId: products[0].id,
      requestedAmount: 150000,
      status: 'REJECTED',
      applicationDate: new Date('2024-12-05'),
      rejectionReason: 'Insufficient collateral value and credit score below threshold'
    }
  });

  console.log(`✅ Created 5 loan applications with collaterals`);
  console.log(`✅ Created 2 active loans with transactions`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - ${loanProducts.count} Loan Products`);
  console.log(`   - 3 Customers`);
  console.log(`   - 5 Loan Applications`);
  console.log(`   - 2 Active Loans`);
  console.log(`   - 5 Transactions`);
  console.log(`   - 4 Collaterals`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
