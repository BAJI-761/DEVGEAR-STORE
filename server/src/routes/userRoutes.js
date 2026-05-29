import { Router } from 'express';
import { addAddress, deleteAddress, getProfile, updateAddress, updateProfile } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequiredBody } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);
router.get('/profile', getProfile);
router.put('/profile', validateRequiredBody(['name']), updateProfile);
router.post('/addresses', validateRequiredBody(['label', 'fullName', 'phone', 'line1', 'city', 'state', 'postalCode']), addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

export default router;