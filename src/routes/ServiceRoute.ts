// Import necessary modules
import { Router } from 'express';
import ServiceController from '../controllers/ServiceController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = Router();

// Define routes
router.patch('/create', isAdmin, ServiceController.createService);
router.patch('/update/:id', isAdmin, ServiceController.updateService);
router.get('/:id', ServiceController.getServiceById);
router.get('/All', ServiceController.getAllServices);
router.delete('/delete/:id', isAdmin, ServiceController.deleteService);

// hijokl
// Export the router
export default router;
