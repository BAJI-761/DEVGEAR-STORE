import { Router } from 'express';
import { createAdminProduct, deleteAdminProduct, getAdminStats, listAdminOrders, listAdminProducts, listAdminUsers, updateAdminOrderStatus, updateAdminProduct } from '../controllers/adminController.js';
import { uploadProductImage } from '../controllers/uploadController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateProductPayload, validateRequiredBody } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/users', listAdminUsers);
router.get('/products', listAdminProducts);
router.post('/products', validateProductPayload, createAdminProduct);
router.put('/products/:productId', validateProductPayload, updateAdminProduct);
router.delete('/products/:productId', deleteAdminProduct);
router.get('/orders', listAdminOrders);
router.patch('/orders/:orderId', validateRequiredBody(['status']), updateAdminOrderStatus);
router.post('/uploads/images', upload.single('image'), uploadProductImage);

export default router;