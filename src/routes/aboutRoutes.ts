import express, { Router } from 'express';
import AboutController from '../controllers/AboutController.ts';

const aboutRouter: Router = express.Router();

// Route to create a new about
aboutRouter.post('/abaut/create', AboutController.createAbouting);

// Route to get all about entries
aboutRouter.get('/AllAbout', AboutController.getAllAbout);

// Route to get a specific about entry by ID
aboutRouter.get('/abaut/:id/getAboutById', AboutController.getAboutById);

// Route to update an existing about entry
aboutRouter.put('/abaut/:id/updateAbout', AboutController.updateAbout);

// Route to delete an existing about entry
aboutRouter.delete('/abaut/:id/deleteAbout', AboutController.deleteAbout);

export default aboutRouter;
