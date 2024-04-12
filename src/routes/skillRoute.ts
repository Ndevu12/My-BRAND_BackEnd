// const necessary modules
import { Router } from 'express';
import skillController from '../controllers/skillController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = Router();

// Define routes
router.patch('/create', isAdmin, skillController.createSkill);
router.patch('/update/:id', isAdmin, skillController.updateSkill);
router.get('/:id', skillController.getSkillById);
router.get('/All', skillController.getAllSkills);
router.delete('/delete/:id', isAdmin, skillController.deleteSkill);

// hijokl
// Export the router
export default router;
