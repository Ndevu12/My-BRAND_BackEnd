// const necessary modules
import { Router} from 'express';
import { experienceController } from '../controllers/experienceController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const ExperienceController = new experienceController();

const experienceRoutes: Router = Router();

experienceRoutes.patch('/create', isAdmin, ExperienceController.createExperience);
experienceRoutes.patch('/update/:id', isAdmin, ExperienceController.updateExperience);
experienceRoutes.delete('/delete/:id', isAdmin,  ExperienceController.deleteExperience);
experienceRoutes.get('/:id', ExperienceController.getExperienceById);
experienceRoutes.get('/All', ExperienceController.getAllExperiences);


export { experienceRoutes };
