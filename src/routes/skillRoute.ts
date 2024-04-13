// const necessary modules
import { Router } from 'express';
import {SkillController } from '../controllers/skillController.js';
import { isAdmin } from '../middlewares/auth.ts';

const skillController = new SkillController();

const skillRoutes: Router = Router();

// Define routes
skillRoutes.patch('/create', isAdmin, skillController.createSkill);
skillRoutes.patch('/update/:id', isAdmin, skillController.updateSkill);
skillRoutes.get('/:id', skillController.getSkillById);
skillRoutes.get('/All', skillController.getAllSkills);
skillRoutes.delete('/delete/:id', isAdmin, skillController.deleteSkill);

// hijokl
// Export the skillRoutes
export { skillRoutes };
