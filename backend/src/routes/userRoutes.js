import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  searchUsers,
  getProfile,
  updateProfile,
} from '../controllers/userController.js';

const router = Router();

router.use(authMiddleware);

router.get('/search', searchUsers);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;