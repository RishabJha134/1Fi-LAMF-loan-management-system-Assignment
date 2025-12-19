import express from 'express';
import {
  getAllLoans,
  getLoanById,
  recordRepayment,
  updateLoanStatus
} from '../controllers/loan.controller.js';

const router = express.Router();

router.get('/', getAllLoans);
router.get('/:id', getLoanById);
router.post('/:id/repayment', recordRepayment);
router.put('/:id/status', updateLoanStatus);

export default router;
