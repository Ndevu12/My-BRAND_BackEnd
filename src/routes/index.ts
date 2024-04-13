
import  express  from 'express';
import { aboutRouter } from './aboutRoutes.ts';
import { AnalyticsRouter } from './AnalyticsRoute.ts';
import { authorRouter } from './AuthorRoute.ts';
import { blogRoutes } from './BlogRouter.ts';
import { blogCategoryRoutes } from './blogCategoryRoute.ts';
import { commentRoutes } from './CommentRoute.ts';
import { educationRoutes } from './EducationRouter.ts';
import { experienceRoutes } from './ExperienceRouter.ts';
import { internshipRoutes } from './InternshipRouter.ts';
import { licenseAndCertificateRoutes } from './licenseAndCertificate.ts';
import { messageRoutes } from './MessageRouter.ts';
import { notificationRoutes } from './NotificationRoute.ts';
import { profileRoutes } from './ProfileRoute.ts';
import { projectRoutes } from './ProjectRoute.ts';
import { serviceRoutes } from './ServiceRoute.ts';
import { skillRoutes } from './skillRoute.ts';
import { spaceStatusRoutes } from './SpaceStatusRoute.ts';
import { subscriberRoutes } from './SubscriberRoute.ts';
import { visitorAnalyticsRoutes } from './VisitorAnalyticsRoute.ts';
import { adminRoutes } from './adminRoutes.ts';

const route = express.Router();

route.use('/about', aboutRouter);
route.use('/analytics', AnalyticsRouter);
route.use('/author', authorRouter);
route.use('/blog', blogRoutes);
route.use('/blog/category', blogCategoryRoutes);
route.use('/comment', commentRoutes);
route.use('/education', educationRoutes);
route.use('/experience', experienceRoutes);
route.use('/internship', internshipRoutes);
route.use('/licenseandcertificate', licenseAndCertificateRoutes);
route.use('/message', messageRoutes);
route.use('/notification', notificationRoutes);
route.use('/profile', profileRoutes);
route.use('/project', projectRoutes);
route.use('/service', serviceRoutes);
route.use('/skill', skillRoutes);
route.use('/spacestatus', spaceStatusRoutes);
route.use('/subscriber', subscriberRoutes);
route.use('/visitoranalytics', visitorAnalyticsRoutes);
route.use('/user', adminRoutes);

export default route;
