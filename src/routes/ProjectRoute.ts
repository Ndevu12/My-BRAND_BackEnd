// Import necessary modules
import express from 'express';
import ProjectController from '../controllers/ProjectController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/create', isAdmin, ProjectController.createProject);
router.put('/update/:id', isAdmin, ProjectController.updateProject);
router.get('/:id', ProjectController.getProjectById);
router.get('/All', ProjectController.getAllProjects);
router.delete('/delete/:id', isAdmin, ProjectController.deleteProject);
// hijokl
// Export the router
export default router;
