import prisma from '../config/prisma.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const [
      totalCustomers,
      totalLoanProducts,
      totalApplications,
      activeLoans,
      totalCollateralValue,
      pendingApplications,
      approvedApplications,
      rejectedApplications
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.loanProduct.count({ where: { status: 'ACTIVE' } }),
      prisma.loanApplication.count(),
      prisma.loan.count({ where: { status: 'ACTIVE' } }),
      prisma.collateral.aggregate({
        where: { status: 'PLEDGED' },
        _sum: { totalValue: true }
      }),
      prisma.loanApplication.count({
        where: {
          status: {
            in: ['SUBMITTED', 'UNDER_REVIEW']
          }
        }
      }),
      prisma.loanApplication.count({ where: { status: 'APPROVED' } }),
      prisma.loanApplication.count({ where: { status: 'REJECTED' } })
    ]);

    // Get total disbursed amount
    const totalDisbursed = await prisma.loan.aggregate({
      _sum: { disbursedAmount: true }
    });

    // Get total outstanding amount
    const totalOutstanding = await prisma.loan.aggregate({
      where: { status: 'ACTIVE' },
      _sum: { outstandingAmount: true }
    });

    // Get recent applications
    const recentApplications = await prisma.loanApplication.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        loanProduct: true
      }
    });

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: { transactionDate: 'desc' },
      include: {
        loan: {
          include: {
            loanApplication: {
              include: {
                customer: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          totalLoanProducts,
          totalApplications,
          activeLoans,
          totalCollateralValue: totalCollateralValue._sum.totalValue || 0,
          totalDisbursed: totalDisbursed._sum.disbursedAmount || 0,
          totalOutstanding: totalOutstanding._sum.outstandingAmount || 0
        },
        applications: {
          pending: pendingApplications,
          approved: approvedApplications,
          rejected: rejectedApplications
        },
        recentApplications,
        recentTransactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};
