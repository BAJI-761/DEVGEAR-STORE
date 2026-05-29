import { Router } from 'express';
import { addOrUpdateCartItem, clearCart, getCart, removeCartItem } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', getCart);
router.post('/items/:productId', addOrUpdateCartItem);
router.delete('/items/:productId', removeCartItem);
router.delete('/', clearCart);

export default router;