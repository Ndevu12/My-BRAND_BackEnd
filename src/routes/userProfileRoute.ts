import { Router } from 'express';
import UserProfileController from '../controllers/userProfileController';
import { isAuth } from '../middlewares/authUtils';
import multer from '../helpers/multer';

const router = Router();

// Get, update, and delete my own profile (must be authenticated)
router.get('/me', isAuth, UserProfileController.getMyProfile);
router.put('/me', isAuth, multer.single('avatar'), UserProfileController.updateMyProfile);
router.delete('/me', isAuth, UserProfileController.deleteMyProfile);

// Get public profile by user ID
router.get('/:userId', UserProfileController.getPublicProfile);

export default router;
