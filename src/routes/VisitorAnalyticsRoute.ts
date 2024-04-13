// const necessary modules
import {Router} from'express';
import { visitorAnalyticsController } from '../controllers/VisitorAnalyticsController.js';
import { isAdmin } from '../middlewares/auth.ts';

const VisitorAnalyticsController = new visitorAnalyticsController();

const visitorAnalyticsRoutes: Router = Router();

// Define routes
visitorAnalyticsRoutes.post('/create', isAdmin, VisitorAnalyticsController.createVisitorAnalytics);
visitorAnalyticsRoutes.put('/update/:id', isAdmin, VisitorAnalyticsController.updateVisitorAnalytics);
visitorAnalyticsRoutes.get('/:id', isAdmin, VisitorAnalyticsController.getVisitorAnalyticsById);
visitorAnalyticsRoutes.get('/All', isAdmin, VisitorAnalyticsController.getAllVisitorAnalytics);
visitorAnalyticsRoutes.delete('/delete/:id', isAdmin, VisitorAnalyticsController.deleteVisitorAnalytics);

// hijokl
// Export the router
export { visitorAnalyticsRoutes };
