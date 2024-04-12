// const necessary modules
import express from'express';
import VisitorAnalyticsController from '../controllers/VisitorAnalyticsController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/create', isAdmin, VisitorAnalyticsController.createVisitorAnalytics);
router.put('/update/:id', isAdmin, VisitorAnalyticsController.updateVisitorAnalytics);
router.get('/:id', isAdmin, VisitorAnalyticsController.getVisitorAnalyticsById);
router.get('/All', isAdmin, VisitorAnalyticsController.getAllVisitorAnalytics);
router.delete('/delete/:id', isAdmin, VisitorAnalyticsController.deleteVisitorAnalytics);

// hijokl
// Export the router
export default router;
