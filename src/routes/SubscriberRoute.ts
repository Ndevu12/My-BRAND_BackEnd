// const necessary modules
import { Router} from 'express';
import SubscriberController  from '../controllers/subscriberController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const subscriberRoutes: Router = Router();

subscriberRoutes.post('/create', SubscriberController.createSubscriber);
subscriberRoutes.put('/update/:id', SubscriberController.updateSubscriber);
subscriberRoutes.get('/:id', SubscriberController.getSubscriberById);
subscriberRoutes.get('/', SubscriberController.getAllSubscribers);
subscriberRoutes.delete('/delete/:id', SubscriberController.deleteSubscriber);

export default subscriberRoutes;
