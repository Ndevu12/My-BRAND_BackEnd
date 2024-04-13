// Import necessary modules
import { Router } from 'express';
import { serviceController } from '../controllers/ServiceController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const ServiceController = new serviceController();
// Create a router instance
const serviceRoutes: Router = Router();

// Define routes
serviceRoutes.patch('/create', isAdmin, ServiceController.createService);
serviceRoutes.patch('/update/:id', isAdmin, ServiceController.updateService);
serviceRoutes.get('/:id', ServiceController.getServiceById);
serviceRoutes.get('/All', ServiceController.getAllServices);
serviceRoutes.delete('/delete/:id', isAdmin, ServiceController.deleteService);

// hijokl
// Export the router
export { serviceRoutes };
