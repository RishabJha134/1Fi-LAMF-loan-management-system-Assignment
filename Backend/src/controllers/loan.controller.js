import prisma from '../config/prisma.js';

// Get all loans (ongoing)
export const getAllLoans = async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = status ? { status } : {};

    const loans = await prisma.loan.findMany({
      where,
      include: {
        loanApplication: {
          include: {
            customer: true,
            loanProduct: true,
            collaterals: true
          }
        },
        transactions: {
          orderBy: { transactionDate: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loans',
      error: error.message
    });
  }
};

// Get single loan
export const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await prisma.loan.findUnique({
      where: { id },
      include: {
        loanApplication: {
          include: {
            customer: true,
            loanProduct: true,
            collaterals: true
          }
        },
        transactions: {
          orderBy: { transactionDate: 'desc' }
        }
      }
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan',
      error: error.message
    });
  }
};

// Record loan repayment
export const recordRepayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, referenceNumber, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid repayment amount'
      });
    }

    const loan = await prisma.loan.findUnique({
      where: { id }
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    if (loan.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Cannot record repayment for inactive loan'
      });
    }

    const repaymentAmount = parseFloat(amount);
    const newOutstanding = loan.outstandingAmount - repaymentAmount;

    // Create transaction and update loan
    const transaction = await prisma.transaction.create({
      data: {
        loanId: id,
        type: 'REPAYMENT',
        amount: repaymentAmount,
        referenceNumber: referenceNumber || `REP-${Date.now()}`,
        notes
      }
    });

    const updatedLoan = await prisma.loan.update({
      where: { id },
      data: {
        outstandingAmount: Math.max(0, newOutstanding),
        status: newOutstanding <= 0 ? 'CLOSED' : 'ACTIVE'
      },
      include: {
        loanApplication: {
          include: {
            customer: true,
            loanProduct: true,
            collaterals: true
          }
        },
        transactions: {
          orderBy: { transactionDate: 'desc' }
        }
      }
    });

    // If loan is closed, release collaterals
    if (newOutstanding <= 0) {
      await prisma.collateral.updateMany({
        where: {
          loanApplicationId: loan.loanApplicationId
        },
        data: {
          status: 'RELEASED'
        }
      });
    }

    res.json({
      success: true,
      message: newOutstanding <= 0 ? 'Loan closed successfully' : 'Repayment recorded successfully',
      data: updatedLoan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording repayment',
      error: error.message
    });
  }
};

// Update loan status
export const updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const loan = await prisma.loan.update({
      where: { id },
      data: { status },
      include: {
        loanApplication: {
          include: {
            customer: true,
            loanProduct: true
          }
        },
        transactions: true
      }
    });

    res.json({
      success: true,
      message: 'Loan status updated successfully',
      data: loan
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating loan status',
      error: error.message
    });
  }
};
