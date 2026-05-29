import { Router } from 'express';
import { createProductReview, deleteOwnReview, listProductReviews, updateOwnReview } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequiredBody } from '../middleware/validate.js';

const router = Router({ mergeParams: true });

router.get('/', listProductReviews);
router.post('/', requireAuth, validateRequiredBody(['rating', 'title', 'comment']), createProductReview);
router.put('/:reviewId', requireAuth, validateRequiredBody(['rating', 'title', 'comment']), updateOwnReview);
router.delete('/:reviewId', requireAuth, deleteOwnReview);

export default router;