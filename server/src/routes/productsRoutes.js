import { Router } from 'express';
import { listProducts, getProductByIdentifier } from '../controllers/productController.js';
import reviewRoutes from './reviewRoutes.js';

const router = Router();

router.get('/', listProducts);
router.get('/:identifier', getProductByIdentifier);
router.use('/:productId/reviews', reviewRoutes);

export default router;