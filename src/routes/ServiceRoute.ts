// Import necessary modules
import { Router } from 'express';
import ServiceController from '../controllers/ServiceController.js';

// Create a router instance
const router = Router();

// Define routes
router.post('/Service/:id/createService', ServiceController.createService);
router.put('/Service/:id/updateService', ServiceController.updateService);
router.get('/Service/:id/getServiceById', ServiceController.getServiceById);
router.get('/Service/getAllServices', ServiceController.getAllServices);
router.delete('/Service/:id/deleteService', ServiceController.deleteService);

// hijokl
// Export the router
export default router;
