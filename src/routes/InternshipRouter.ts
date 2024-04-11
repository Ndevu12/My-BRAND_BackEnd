// const necessary modules
import express from 'express';
import InternshipController from '../controllers/InternshipController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/Internship/:id/createInternship', InternshipController.createInternship);
router.put('/Internship/:id/updateInternship', InternshipController.updateInternship);
router.get('/Internship/:id/getInternshipById', InternshipController.getInternshipById)
router.get('/Internship/getAllInternships', InternshipController.getAllInternships);;
router.delete('/Internship/:id/deleteInternship', InternshipController.deleteInternship);

// hijokl
// Export the router
export default router;
