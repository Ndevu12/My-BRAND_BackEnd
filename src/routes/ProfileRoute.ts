// const necessary modules
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController.js';

// Create a router instance
const router = Router();

// Define routes
router.post('/Profile/:id/createProfile', ProfileController.createProfile);
router.put('/Profile/:id/updateProfile', ProfileController.updateProfile);
router.get('/Profile/:id/getProfileById', ProfileController.getProfileById);
router.get('/Profile/getAllProfiles', ProfileController.getAllProfiles);
router.delete('/Profile/:id/deleteProfile', ProfileController.deleteProfile);


// Export the router
export default router;
