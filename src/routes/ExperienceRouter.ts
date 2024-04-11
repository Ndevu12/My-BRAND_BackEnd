// const necessary modules
import express from 'express';
import ExperienceController from '../controllers/experienceController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/Experience/:id/createExperience', ExperienceController.createExperience);
router.put('/Experience/:id/updateExperience', ExperienceController.updateExperience);
router.get('/Experience/:id/getExperienceById', ExperienceController.getExperienceById);
router.get('/Experience/getAllExperiences', ExperienceController.getAllExperiences);
router.delete('/Experience/:id/deleteExperience', ExperienceController.deleteExperience);

// hijokl
// Export the router
export default router;
