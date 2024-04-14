
import  express from 'express';
import authorRouter  from './AuthorRoute.ts';
import blogRoutes  from './BlogRouter.ts';
import blogCategoryRoutes  from './blogCategoryRoute.ts';
import commentRoutes  from './CommentRoute.ts';
import messageRoutes  from './MessageRouter.ts';
import notificationRoutes  from './NotificationRoute.ts';
import subscriberRoutes  from './SubscriberRoute.ts';
import adminRoutes  from './userRoutes.ts';

const route = express.Router();

route.use('/author', authorRouter);
route.use('/blog', blogRoutes);
route.use('/blog/category', blogCategoryRoutes);
route.use('/comment', commentRoutes);
route.use('/message', messageRoutes);
route.use('/notification', notificationRoutes);
route.use('/subscriber', subscriberRoutes);
route.use('/user', adminRoutes);

export default route;
