import { Router } from 'express';
import { cancelMyOrder, createOrderFromCart, getMyOrderById, listMyOrders } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateOrderPlacement } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);
router.post('/', validateOrderPlacement, createOrderFromCart);
router.get('/', listMyOrders);
router.get('/:orderId', getMyOrderById);
router.patch('/:orderId/cancel', cancelMyOrder);

export default router;