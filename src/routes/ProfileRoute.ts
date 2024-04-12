// const necessary modules
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = Router();

// Define routes
router.post('/create', isAdmin, ProfileController.createProfile);
router.put('/update/:id', isAdmin, ProfileController.updateProfile);
router.get('/:id', ProfileController.getProfileById);
router.get('/All', ProfileController.getAllProfiles);
router.delete('/delete/:id', isAdmin, ProfileController.deleteProfile);


// Export the router
export default router;
