// Import necessary modules
import { Router } from 'express';
import AnalyticsController from '../controllers/AnalyticsController.ts';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const AnalyticsRouter: Router  = Router();

// Define routes
AnalyticsRouter.patch('/create', isAdmin, AnalyticsController.createAnalytics);
AnalyticsRouter.patch('/update/:id', isAdmin, AnalyticsController.updateAnalytics);
AnalyticsRouter.delete('/delete/:id', isAdmin, AnalyticsController.deleteAnalytics);
AnalyticsRouter.get('/:id', isAdmin, AnalyticsController.getAnalyticsById);
AnalyticsRouter.get('/All', isAdmin, AnalyticsController.getAllAnalyticss);

// hijokl
// Export the router
export default AnalyticsRouter;
