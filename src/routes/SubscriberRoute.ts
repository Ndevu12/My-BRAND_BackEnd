// const necessary modules
import { Router} from 'express';
import SubscriberController  from '../controllers/subscriberController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const subscriberRoutes: Router = Router();

subscriberRoutes.post('/create', isAdmin, SubscriberController.createSubscriber);
subscriberRoutes.put('/update/:id', isAdmin, SubscriberController.updateSubscriber);
subscriberRoutes.get('/:id', isAdmin, SubscriberController.getSubscriberById);
subscriberRoutes.get('/All', isAdmin, SubscriberController.getAllSubscribers);
subscriberRoutes.delete('/delete/:id', isAdmin, SubscriberController.deleteSubscriber);

export default subscriberRoutes;
