import prisma from '../config/prisma.js';


export const getAllCollaterals = async (req, res) => {
  try {
    const { status, loanApplicationId } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (loanApplicationId) where.loanApplicationId = loanApplicationId;

    const collaterals = await prisma.collateral.findMany({
      where,
      include: {
        loanApplication: {
          include: {
            customer: true,
            loanProduct: true,
            loan: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: collaterals.length,
      data: collaterals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collaterals',
      error: error.message
    });
  }
};


export const getCollateralsByApplicationId = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const collaterals = await prisma.collateral.findMany({
      where: {
        loanApplicationId: applicationId
      },
      include: {
        loanApplication: {
          include: {
            customer: true,
            loanProduct: true
          }
        }
      }
    });

    res.json({
      success: true,
      count: collaterals.length,
      data: collaterals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collaterals',
      error: error.message
    });
  }
};

export const getCollateralById = async (req, res) => {
  try {
    const { id } = req.params;

    const collateral = await prisma.collateral.findUnique({
      where: { id },
      include: {
        loanApplication: {
          include: {
            customer: true,
            loanProduct: true,
            loan: true
          }
        }
      }
    });

    if (!collateral) {
      return res.status(404).json({
        success: false,
        message: 'Collateral not found'
      });
    }

    res.json({
      success: true,
      data: collateral
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collateral',
      error: error.message
    });
  }
};

export const createCollateral = async (req, res) => {
  try {
    const {
      loanApplicationId,
      fundName,
      folioNumber,
      units,
      navPerUnit
    } = req.body;

    if (!loanApplicationId || !fundName || !folioNumber || !units || !navPerUnit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const collateral = await prisma.collateral.create({
      data: {
        loanApplicationId,
        fundName,
        folioNumber,
        units: parseFloat(units),
        navPerUnit: parseFloat(navPerUnit),
        totalValue: parseFloat(units) * parseFloat(navPerUnit),
        status: 'PLEDGED'
      },
      include: {
        loanApplication: {
          include: {
            customer: true,
            loanProduct: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Collateral added successfully',
      data: collateral
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating collateral',
      error: error.message
    });
  }
};

export const updateCollateralStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const collateral = await prisma.collateral.update({
      where: { id },
      data: { status },
      include: {
        loanApplication: {
          include: {
            customer: true,
            loanProduct: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Collateral status updated successfully',
      data: collateral
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Collateral not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating collateral status',
      error: error.message
    });
  }
};

export const deleteCollateral = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.collateral.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Collateral deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Collateral not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting collateral',
      error: error.message
    });
  }
};
