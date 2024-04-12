// const necessary modules
import express from 'express';
import SpaceStatusController from '../controllers/spaceStatusController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/create', isAdmin, SpaceStatusController.createSpaceStatus);
router.put('/update/:id', isAdmin, SpaceStatusController.updateSpaceStatus);
router.get('/:id', isAdmin, SpaceStatusController.getSpaceStatusById);
router.get('/All',isAdmin, SpaceStatusController.getAllSpaceStatuses);
router.delete('/delete/:id', isAdmin, SpaceStatusController.deleteSpaceStatus);

// hijokl
// Export the router
export default router;
