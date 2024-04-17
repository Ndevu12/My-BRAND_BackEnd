// const necessary modules
import { Router} from 'express';
import SubscriberController  from '../controllers/subscriberController.ts';
import { isAdmin } from '../middlewares/authentication.ts';
import UserValidation from '../middlewares/validation/validate.ts';

const subscriberRoutes: Router = Router();

subscriberRoutes.post('/create',  UserValidation.subscribe, SubscriberController.createSubscriber);
subscriberRoutes.put('/update/:id', SubscriberController.updateSubscriber);
subscriberRoutes.get('/:id',isAdmin, SubscriberController.getSubscriberById);
subscriberRoutes.get('/', isAdmin, SubscriberController.getAllSubscribers);
subscriberRoutes.delete('/delete/:id',isAdmin, SubscriberController.deleteSubscriber);

export default subscriberRoutes;
