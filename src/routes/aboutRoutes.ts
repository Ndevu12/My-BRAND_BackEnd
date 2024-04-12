import express, { Router } from 'express';
import AboutController from '../controllers/AboutController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const aboutRouter: Router = express.Router();

// Route to create a new about
aboutRouter.patch('/create', isAdmin, AboutController.createAbouting);

// Route to get all about entries
aboutRouter.get('/All', AboutController.getAllAbout);

// Route to get a specific about entry by ID
aboutRouter.get('/get/:id', AboutController.getAboutById);

// Route to update an existing about entry
aboutRouter.patch('/update/:id', isAdmin, AboutController.updateAbout);

// Route to delete an existing about entry
aboutRouter.delete('/delete/:id', isAdmin, AboutController.deleteAbout);

export default aboutRouter;
