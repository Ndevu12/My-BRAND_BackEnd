import express, { Router } from 'express';
import {AboutController} from '../controllers/AboutController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const aboutRouter: Router = express.Router();
const aboutController = new AboutController();

aboutRouter.patch('/create', isAdmin, aboutController.createAbouting);

// Route to get all about entries
aboutRouter.get('/All', aboutController.getAllAbout);

// Route to get a specific about entry by ID
aboutRouter.get('/get/:id', aboutController.getAboutById);

// Route to update an existing about entry
aboutRouter.patch('/update/:id', isAdmin, aboutController.updateAbout);

// Route to delete an existing about entry
aboutRouter.delete('/delete/:id', isAdmin, aboutController.deleteAbout);

export {aboutRouter};
