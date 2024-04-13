// const necessary modules
import { Router} from 'express';
import { subscriberController } from '../controllers/subscriberController.js';
import { isAdmin } from '../middlewares/auth.ts';

const SubscriberController = new subscriberController();
const subscriberRoutes: Router = Router();

subscriberRoutes.post('/create', isAdmin, SubscriberController.createSubscriber);
subscriberRoutes.put('/update/:id', isAdmin, SubscriberController.updateSubscriber);
subscriberRoutes.get('/:id', isAdmin, SubscriberController.getSubscriberById);
subscriberRoutes.get('/All', isAdmin, SubscriberController.getAllSubscribers);
subscriberRoutes.delete('/delete/:id', isAdmin, SubscriberController.deleteSubscriber);

export { subscriberRoutes };
