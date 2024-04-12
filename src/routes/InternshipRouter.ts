// const necessary modules
import express from 'express';
import InternshipController from '../controllers/InternshipController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.patch('/create', isAdmin, InternshipController.createInternship);
router.patch('/update/:id', isAdmin, InternshipController.updateInternship);
router.get('/:id', InternshipController.getInternshipById)
router.get('/All', InternshipController.getAllInternships);;
router.delete('/delete/:id', isAdmin, InternshipController.deleteInternship);

// hijokl
// Export the router
export default router;
