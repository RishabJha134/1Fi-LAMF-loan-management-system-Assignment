import prisma from '../config/prisma.js';

export const getAllLoanProducts = async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = status ? { status } : {};
    
    const products = await prisma.loanProduct.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan products',
      error: error.message
    });
  }
};

export const getLoanProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.loanProduct.findUnique({
      where: { id },
      include: {
        loanApplications: {
          include: {
            customer: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Loan product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan product',
      error: error.message
    });
  }
};

export const createLoanProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      interestRate,
      maxLoanAmount,
      minLoanAmount,
      maxTenure,
      processingFee,
      ltvRatio,
      status
    } = req.body;

    if (!name || !interestRate || !maxLoanAmount || !minLoanAmount || !maxTenure || !processingFee || !ltvRatio) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const product = await prisma.loanProduct.create({
      data: {
        name,
        description,
        interestRate: parseFloat(interestRate),
        maxLoanAmount: parseFloat(maxLoanAmount),
        minLoanAmount: parseFloat(minLoanAmount),
        maxTenure: parseInt(maxTenure),
        processingFee: parseFloat(processingFee),
        ltvRatio: parseFloat(ltvRatio),
        status: status || 'ACTIVE'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Loan product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating loan product',
      error: error.message
    });
  }
};

export const updateLoanProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.interestRate) updateData.interestRate = parseFloat(updateData.interestRate);
    if (updateData.maxLoanAmount) updateData.maxLoanAmount = parseFloat(updateData.maxLoanAmount);
    if (updateData.minLoanAmount) updateData.minLoanAmount = parseFloat(updateData.minLoanAmount);
    if (updateData.maxTenure) updateData.maxTenure = parseInt(updateData.maxTenure);
    if (updateData.processingFee) updateData.processingFee = parseFloat(updateData.processingFee);
    if (updateData.ltvRatio) updateData.ltvRatio = parseFloat(updateData.ltvRatio);

    const product = await prisma.loanProduct.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Loan product updated successfully',
      data: product
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Loan product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating loan product',
      error: error.message
    });
  }
};

export const deleteLoanProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.loanProduct.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Loan product deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Loan product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting loan product',
      error: error.message
    });
  }
};
