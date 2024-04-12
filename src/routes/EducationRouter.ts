// const necessary modules
import express from 'express';
import EducationController from '../controllers/EducationController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.patch('/create', isAdmin, EducationController.createEducation);
router.patch('/update/:id', isAdmin, EducationController.updateEducation);
router.delete('/delete/:id', isAdmin, EducationController.deleteEducation);
router.get('/:id', EducationController.getEducationById);
router.get('/All', EducationController.getAllEducations);


// hijokl
// Export the router
export default router;
