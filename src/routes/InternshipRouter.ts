// const necessary modules
import { Router} from 'express';
import { internshipController } from '../controllers/InternshipController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const InternshipController = new internshipController();
// Create a router instance
const internshipRoutes: Router = Router();

// Define routes
internshipRoutes.patch('/create', isAdmin, InternshipController.createInternship);
internshipRoutes.patch('/update/:id', isAdmin, InternshipController.updateInternship);
internshipRoutes.get('/:id', InternshipController.getInternshipById)
internshipRoutes.get('/All', InternshipController.getAllInternships);;
internshipRoutes.delete('/delete/:id', isAdmin, InternshipController.deleteInternship);

export {internshipRoutes};
