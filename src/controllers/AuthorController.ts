/**
 * Controller for handling Author-related operations.
 */
import { Request, Response } from 'express';
import AuthorService  from '../services/authorSrvice.ts';
import {IAuthor } from '../models/author.ts';


class authorController {
    /**
     * Method to create a new author.
     * @param req Request object containing author data.
     * @param res Response object to send the result.
     */
   static async createAuthor(req: Request, res: Response): Promise<void> {
        try {
            const authorData: IAuthor = req.body;
            const newAuthor = await AuthorService.createAuthor(authorData);
            res.status(201).json(newAuthor);
        } catch (error) {
            console.error('Error creating author:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Method to retrieve all authors.
     * @param req Request object.
     * @param res Response object to send the authors.
     */
   static async getAllAuthors(req: Request, res: Response): Promise<void> {
        try {
            const authors = await AuthorService.getAllAuthors();
            res.status(200).json(authors);
        } catch (error) {
            console.error('Error fetching authors:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Method to retrieve an author by their ID.
     * @param req Request object containing the author ID.
     * @param res Response object to send the author.
     */
   static async getAuthorById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const author = await AuthorService.findAuthorById(id);
            if (author) {
                res.status(200).json(author);
            } else {
                res.status(404).json({ error: 'Author not found' });
            }
        } catch (error) {
            console.error('Error fetching author by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Method to update an author by their ID.
     * @param req Request object containing the author ID and updated data.
     * @param res Response object to send the updated author.
     */
   static async updateAuthor(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedAuthorData = req.body;
            const updatedAuthor = await AuthorService.updateAuthor(id, updatedAuthorData);
            if (updatedAuthor) {
                res.status(200).json(updatedAuthor);
            } else {
                res.status(404).json({ error: 'Author not found' });
            }
        } catch (error) {
            console.error('Error updating author:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Method to delete an author by their ID.
     * @param req Request object containing the author ID.
     * @param res Response object to send the result.
     */
   static async deleteAuthor(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedAuthor = await AuthorService.deleteAuthor(id);
            if (deletedAuthor) {
                res.status(200).json({ message: 'Author deleted successfully' });
            } else {
                res.status(404).json({ error: 'Author not found' });
            }
        } catch (error) {
            console.error('Error deleting author:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default authorController;
