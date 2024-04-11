import { Router } from 'express';
// const AdminController from '../controllers/adminController');
import AdminController from '../controllers/adminController.ts';

const router: Router = Router();

// Route to register a new admin
router.post('/admin/:id/register',AdminController.registerAdmin);
router.get('/admin/:id/login',AdminController.loginAdmin);

// router.get('/admin',AdminController.registerAdmin);
// router.get('/admin',AdminController.registerAdmin);
// router.post('/admin',AdminController.registerAdmin);
// router.post('/admin',AdminController.registerAdmin);
// router.put('/admin/:id/updateAdminData',AdminController.updateAdminData);
// router.delete('/admin/:id/removeAdmin',AdminController.removeAdmin);

// hijokl
export default router;
