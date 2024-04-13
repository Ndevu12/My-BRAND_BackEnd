// const necessary modules
import { Router} from 'express';
import {educationController} from '../controllers/EducationController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const EducationController = new educationController();

const educationRoutes: Router = Router();

educationRoutes.patch('/create', isAdmin, EducationController.createEducation);
educationRoutes.patch('/update/:id', isAdmin, EducationController.updateEducation);
educationRoutes.delete('/delete/:id', isAdmin, EducationController.deleteEducation);
educationRoutes.get('/:id', EducationController.getEducationById);
educationRoutes.get('/All', EducationController.getAllEducations);

export { educationRoutes };
