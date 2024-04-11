// const necessary modules
import express from 'express';
import EducationController from '../controllers/EducationController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/Education/:id/createEducation', EducationController.createEducation);
router.put('/Education/:id/updateEducation', EducationController.updateEducation);
router.get('/Education/:id/getEducationById', EducationController.getEducationById);
router.get('/Education/:id/getAllEducations', EducationController.getAllEducations);
router.delete('/Education/:id/deleteEducation', EducationController.deleteEducation);

// hijokl
// Export the router
export default router;
