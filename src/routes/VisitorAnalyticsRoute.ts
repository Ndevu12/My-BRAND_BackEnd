// const necessary modules
import express from'express';
import VisitorAnalyticsController from '../controllers/VisitorAnalyticsController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/VisitorAnalytics/:id/createVisitorAnalytics', VisitorAnalyticsController.createVisitorAnalytics);
router.put('/VisitorAnalytics/:id/updateVisitorAnalytics', VisitorAnalyticsController.updateVisitorAnalytics);
router.get('/VisitorAnalytics/:id/getVisitorAnalyticsById', VisitorAnalyticsController.getVisitorAnalyticsById);
router.get('/VisitorAnalytics/getAllVisitorAnalytics', VisitorAnalyticsController.getAllVisitorAnalytics);
router.delete('/Visi torAnalytics/:id/deleteVisitorAnalytics', VisitorAnalyticsController.deleteVisitorAnalytics);

// hijokl
// Export the router
export default router;
