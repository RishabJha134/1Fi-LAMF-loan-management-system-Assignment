import express from 'express';
import {
  getAllLoanProducts,
  getLoanProductById,
  createLoanProduct,
  updateLoanProduct,
  deleteLoanProduct
} from '../controllers/loanProduct.controller.js';

const router = express.Router();

router.get('/', getAllLoanProducts);
router.get('/:id', getLoanProductById);
router.post('/', createLoanProduct);
router.put('/:id', updateLoanProduct);
router.delete('/:id', deleteLoanProduct);

export default router;
