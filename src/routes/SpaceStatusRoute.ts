// const necessary modules
import { Router} from 'express';
import { spaceStatusController } from '../controllers/spaceStatusController.js';
import { isAdmin } from '../middlewares/auth.ts';

const SpaceStatusController = new spaceStatusController();
const spaceStatusRoutes: Router = Router();

// Define routes
spaceStatusRoutes.post('/create', isAdmin, SpaceStatusController.createSpaceStatus);
spaceStatusRoutes.put('/update/:id', isAdmin, SpaceStatusController.updateSpaceStatus);
spaceStatusRoutes.get('/:id', isAdmin, SpaceStatusController.getSpaceStatusById);
spaceStatusRoutes.get('/All',isAdmin, SpaceStatusController.getAllSpaceStatuses);
spaceStatusRoutes.delete('/delete/:id', isAdmin, SpaceStatusController.deleteSpaceStatus);

// hijokl
// Export the router
export { spaceStatusRoutes };
