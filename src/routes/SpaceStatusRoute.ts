// const necessary modules
import express from 'express';
import SpaceStatusController from '../controllers/spaceStatusController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/SpaceStatus/:id/createSpaceStatus', SpaceStatusController.createSpaceStatus);
router.put('/SpaceStatus/:id/updateSpaceStatus', SpaceStatusController.updateSpaceStatus);
router.get('/SpaceStatus/:id/getSpaceStatusById', SpaceStatusController.getSpaceStatusById);
router.get('/SpaceStatus/getAllSpaceStatuses', SpaceStatusController.getAllSpaceStatuses);
router.delete('/SpaceStatus/:id/deleteSpaceStatus', SpaceStatusController.deleteSpaceStatus);

// hijokl
// Export the router
export default router;
