// Import necessary modules
import { Router} from 'express';
import { projectController } from '../controllers/ProjectController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const ProjectController= new projectController();
const projectRoutes: Router = Router();

// Define routes
projectRoutes.post('/create', isAdmin, ProjectController.createProject);
projectRoutes.put('/update/:id', isAdmin, ProjectController.updateProject);
projectRoutes.get('/:id', ProjectController.getProjectById);
projectRoutes.get('/All', ProjectController.getAllProjects);
projectRoutes.delete('/delete/:id', isAdmin, ProjectController.deleteProject);
// hijokl
// Export the router
export {projectRoutes};
