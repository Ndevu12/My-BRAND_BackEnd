// const necessary modules
import { Router } from 'express';
import skillController from '../controllers/skillController.js';

// Create a router instance
const router = Router();

// Define routes
router.post('/skill/:id/createSkill', skillController.createSkill);
router.put('/skill/:id/updateSkill', skillController.updateSkill);
router.get('/skill/:id/getSkillById', skillController.getSkillById);
router.get('/skill/getAllSkills', skillController.getAllSkills);
router.delete('/skill/:id/deleteSkill', skillController.deleteSkill);

// hijokl
// Export the router
export default router;
