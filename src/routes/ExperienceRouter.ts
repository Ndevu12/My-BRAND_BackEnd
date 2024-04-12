// const necessary modules
import express from 'express';
import ExperienceController from '../controllers/experienceController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.patch('/create', isAdmin, ExperienceController.createExperience);
router.patch('/update/:id', isAdmin, ExperienceController.updateExperience);
router.delete('/delete/:id', isAdmin,  ExperienceController.deleteExperience);
router.get('/:id', ExperienceController.getExperienceById);
router.get('/All', ExperienceController.getAllExperiences);


// hijokl
// Export the router
export default router;
