// Import necessary modules
import { Router } from 'express';
import AnalyticsController from '../controllers/AnalyticsController.ts';

// Create a router instance
const AnalyticsRouter: Router  = Router();

// Define routes
AnalyticsRouter.get('/analytics/:id/getAllAnalyticss)', AnalyticsController.getAllAnalyticss);
AnalyticsRouter.get('/analytics/getAnalyticsById', AnalyticsController.getAnalyticsById);
AnalyticsRouter.post('/analytics/:id/createAnalytics', AnalyticsController.createAnalytics);
AnalyticsRouter.put('/analytics/:id/updateAnalytics', AnalyticsController.updateAnalytics);
AnalyticsRouter.delete('/analytics/:id/deleteAnalytics', AnalyticsController.deleteAnalytics);

// hijokl
// Export the router
export default AnalyticsRouter;
