/**
 * Controller for handling Message-related operations.
 */
import { Request, Response } from "express";
import { IMessage } from "../models/messages.ts";
import MessageService from "../services/messageService.ts";

class messageController {
  /**
   * Method to create a new MessageService
   * @param req Request object containing message data.
   * @param res Response object to send the result.
   */
  static async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const messageData: IMessage = req.body;
      const newMessage = await MessageService.createMessage(messageData);
      if (!newMessage) {
        res.status(404).json({ error: "Message not created" });
        return;
      }
      res.status(201).json({ Message: "Message sent!" });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  /**
   * Method to retrieve all messages.
   * @param req Request object.
   * @param res Response object to send the messages.
   */
  static async getAllMessages(req: Request, res: Response): Promise<void> {
    try {
      const messages = await MessageService.getAllMessages();
      if (!messages) {
        res.status(404).json({ error: "Messages not found" });
        return;
      }

      res.status(200).json({ Message: "All messages retrieved!", messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Sorry, Something went wrong" });
    }
  }

  /**
   * Method to retrieve a message by its ID.
   * @param req Request object containing the message ID.
   * @param res Response object to send the MessageService
   */
  static async getMessageById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const message = await MessageService.findMessageById(id);
      if (message) {
        res.status(200).json(message);
      } else {
        res.status(404).json({ error: "Message not found" });
      }
    } catch (error) {
      console.error("Error fetching message by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Method to delete a message by its ID.
   * @param req Request object containing the message ID.
   * @param res Response object to send the result.
   */
  static async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedMessage = await MessageService.deleteMessage(id);
      if (deletedMessage) {
        res.status(200).json({ message: "Message deleted successfully" });
      } else {
        res.status(404).json({ error: "Message not found" });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default messageController;
