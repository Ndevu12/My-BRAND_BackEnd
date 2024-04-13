// const necessary modules
import { Router } from 'express';
import { profileController } from '../controllers/ProfileController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const ProfileController = new profileController();

const profileRoutes: Router = Router();


profileRoutes.post('/create', isAdmin, ProfileController.createProfile);
profileRoutes.put('/update/:id', isAdmin, ProfileController.updateProfile);
profileRoutes.get('/:id', ProfileController.getProfileById);
profileRoutes.get('/All', ProfileController.getAllProfiles);
profileRoutes.delete('/delete/:id', isAdmin, ProfileController.deleteProfile);


// Export the router
export { profileRoutes };
