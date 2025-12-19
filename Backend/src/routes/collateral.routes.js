import express from 'express';
import {
  getAllCollaterals,
  getCollateralsByApplicationId,
  getCollateralById,
  createCollateral,
  updateCollateralStatus,
  deleteCollateral
} from '../controllers/collateral.controller.js';

const router = express.Router();

router.get('/', getAllCollaterals);
router.get('/application/:applicationId', getCollateralsByApplicationId);
router.get('/:id', getCollateralById);
router.post('/', createCollateral);
router.put('/:id/status', updateCollateralStatus);
router.delete('/:id', deleteCollateral);

export default router;
