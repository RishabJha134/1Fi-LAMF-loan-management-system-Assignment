import prisma from '../config/prisma.js';

export const getAllLoanApplications = async (req, res) => {
  try {
    const { status, customerId } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const applications = await prisma.loanApplication.findMany({
      where,
      include: {
        customer: true,
        loanProduct: true,
        collaterals: true,
        loan: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan applications',
      error: error.message
    });
  }
};

export const getLoanApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.loanApplication.findUnique({
      where: { id },
      include: {
        customer: true,
        loanProduct: true,
        collaterals: true,
        loan: {
          include: {
            transactions: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan application',
      error: error.message
    });
  }
};

export const createLoanApplication = async (req, res) => {
  try {
    const {
      customer,
      loanProductId,
      requestedAmount,
      collaterals
    } = req.body;

    if (!customer || !loanProductId || !requestedAmount || !collaterals || collaterals.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer details, loan product, requested amount, and collaterals'
      });
    }

    const loanProduct = await prisma.loanProduct.findUnique({
      where: { id: loanProductId }
    });

    if (!loanProduct) {
      return res.status(404).json({
        success: false,
        message: 'Loan product not found'
      });
    }

    if (requestedAmount < loanProduct.minLoanAmount || requestedAmount > loanProduct.maxLoanAmount) {
      return res.status(400).json({
        success: false,
        message: `Requested amount must be between ${loanProduct.minLoanAmount} and ${loanProduct.maxLoanAmount}`
      });
    }

    const totalCollateralValue = collaterals.reduce((sum, col) => {
      return sum + (parseFloat(col.units) * parseFloat(col.navPerUnit));
    }, 0);

    const maxLoanByLTV = totalCollateralValue * loanProduct.ltvRatio;
    if (requestedAmount > maxLoanByLTV) {
      return res.status(400).json({
        success: false,
        message: `Insufficient collateral. Maximum loan amount based on LTV ratio (${loanProduct.ltvRatio * 100}%): ${maxLoanByLTV.toFixed(2)}`
      });
    }

    let existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: customer.email },
          { panCard: customer.panCard }
        ]
      }
    });

    if (!existingCustomer) {
      existingCustomer = await prisma.customer.create({
        data: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          panCard: customer.panCard,
          address: customer.address,
          city: customer.city,
          pincode: customer.pincode
        }
      });
    }

    const application = await prisma.loanApplication.create({
      data: {
        customerId: existingCustomer.id,
        loanProductId,
        requestedAmount: parseFloat(requestedAmount),
        status: 'SUBMITTED',
        collaterals: {
          create: collaterals.map(col => ({
            fundName: col.fundName,
            folioNumber: col.folioNumber,
            units: parseFloat(col.units),
            navPerUnit: parseFloat(col.navPerUnit),
            totalValue: parseFloat(col.units) * parseFloat(col.navPerUnit),
            status: 'PLEDGED'
          }))
        }
      },
      include: {
        customer: true,
        loanProduct: true,
        collaterals: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Loan application created successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating loan application',
      error: error.message
    });
  }
};

export const updateLoanApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, sanctionedAmount, tenureMonths } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const application = await prisma.loanApplication.findUnique({
      where: { id },
      include: {
        loanProduct: true
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    if (status === 'APPROVED' || status === 'DISBURSED') {
      const amount = sanctionedAmount || application.requestedAmount;
      const tenure = tenureMonths || 12;
      
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + tenure);

      const updatedApplication = await prisma.loanApplication.update({
        where: { id },
        data: {
          status,
          approvalDate: new Date(),
          loan: {
            create: {
              sanctionedAmount: parseFloat(amount),
              disbursedAmount: status === 'DISBURSED' ? parseFloat(amount) : 0,
              interestRate: application.loanProduct.interestRate,
              tenureMonths: tenure,
              endDate,
              outstandingAmount: parseFloat(amount),
              status: status === 'DISBURSED' ? 'ACTIVE' : 'ACTIVE',
              transactions: status === 'DISBURSED' ? {
                create: {
                  type: 'DISBURSEMENT',
                  amount: parseFloat(amount),
                  referenceNumber: `DISB-${Date.now()}`,
                  notes: 'Loan disbursed successfully'
                }
              } : undefined
            }
          }
        },
        include: {
          customer: true,
          loanProduct: true,
          collaterals: true,
          loan: {
            include: {
              transactions: true
            }
          }
        }
      });

      return res.json({
        success: true,
        message: `Loan application ${status.toLowerCase()} successfully`,
        data: updatedApplication
      });
    }

    if (status === 'REJECTED') {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Please provide rejection reason'
        });
      }

      const updatedApplication = await prisma.loanApplication.update({
        where: { id },
        data: {
          status,
          rejectionReason
        },
        include: {
          customer: true,
          loanProduct: true,
          collaterals: true
        }
      });

      return res.json({
        success: true,
        message: 'Loan application rejected',
        data: updatedApplication
      });
    }

    const updatedApplication = await prisma.loanApplication.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        loanProduct: true,
        collaterals: true
      }
    });

    res.json({
      success: true,
      message: 'Loan application status updated',
      data: updatedApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating loan application',
      error: error.message
    });
  }
};

export const deleteLoanApplication = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.loanApplication.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Loan application deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting loan application',
      error: error.message
    });
  }
};
