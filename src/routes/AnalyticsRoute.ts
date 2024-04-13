// Import necessary modules
import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const analyticsController = new AnalyticsController();
const AnalyticsRouter: Router  = Router();

// Define routes
AnalyticsRouter.patch('/create', isAdmin, analyticsController.createAnalytics);
AnalyticsRouter.patch('/update/:id', isAdmin, analyticsController.updateAnalytics);
AnalyticsRouter.delete('/delete/:id', isAdmin, analyticsController.deleteAnalytics);
AnalyticsRouter.get('/:id', isAdmin, analyticsController.getAnalyticsById);
AnalyticsRouter.get('/All', isAdmin, analyticsController.getAllAnalyticss);

// hijokl
// Export the router
export  {AnalyticsRouter};
