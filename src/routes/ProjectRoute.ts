// Import necessary modules
import express from 'express';
import ProjectController from '../controllers/ProjectController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/Project/:id/createProject', ProjectController.createProject);
router.put('/Project/:id/updateProject', ProjectController.updateProject);
router.get('/Project/:id/getProjectById', ProjectController.getProjectById);
router.get('/Project/getAllProjects', ProjectController.getAllProjects);
router.delete('/Project/:id/deleteProject', ProjectController.deleteProject);
// hijokl
// Export the router
export default router;
