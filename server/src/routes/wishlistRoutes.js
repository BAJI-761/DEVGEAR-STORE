import { Router } from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', getWishlist);
router.post('/items/:productId', addToWishlist);
router.delete('/items/:productId', removeFromWishlist);

export default router;