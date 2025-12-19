import express from 'express';
import {
  getAllLoanApplications,
  getLoanApplicationById,
  createLoanApplication,
  updateLoanApplicationStatus,
  deleteLoanApplication
} from '../controllers/loanApplication.controller.js';

const router = express.Router();

router.get('/', getAllLoanApplications);
router.get('/:id', getLoanApplicationById);
router.post('/', createLoanApplication);
router.put('/:id/status', updateLoanApplicationStatus);
router.delete('/:id', deleteLoanApplication);

export default router;
