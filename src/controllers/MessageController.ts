/**
 * Controller for handling Message-related operations.
 */
import { Request, Response } from "express";
import { IMessage } from "../models/messages";
import MessageService from "../services/messageService";
import response from "../helpers/response";

class messageController {
  /**
   * Method to create a new MessageService
   * @param req Request object containing message data.
   * @param res Response object to send the result.
   */  static async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const messageData: IMessage = req.body;
      const newMessage = await MessageService.createMessage(messageData);
      if (!newMessage) {
        response(res, 404, "Message not created", null, "MESSAGE_CREATION_FAILED");
        return;
      }
      response(res, 201, "Message sent successfully", newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }

  /**
   * Method to retrieve all messages.
   * @param req Request object.
   * @param res Response object to send the messages.
   */  static async getAllMessages(req: Request, res: Response): Promise<void> {
    try {
      const messages = await MessageService.getAllMessages();
      if (!messages) {
        response(res, 404, "Messages not found", null, "MESSAGES_NOT_FOUND");
        return;
      }

      response(res, 200, "All messages retrieved successfully", messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      response(res, 500, "Sorry, Something went wrong", null, "SERVER_ERROR");
    }
  }

  /**
   * Method to retrieve a message by its ID.
   * @param req Request object containing the message ID.
   * @param res Response object to send the MessageService
   */  static async getMessageById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const message = await MessageService.findMessageById(id);
      if (message) {
        response(res, 200, "Message retrieved successfully", message);
      } else {
        response(res, 404, "Message not found", null, "MESSAGE_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error fetching message by ID:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }

  /**
   * Method to delete a message by its ID.
   * @param req Request object containing the message ID.
   * @param res Response object to send the result.
   */  static async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedMessage = await MessageService.deleteMessage(id);
      if (deletedMessage) {
        response(res, 200, "Message deleted successfully", null);
      } else {
        response(res, 404, "Message not found", null, "MESSAGE_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }
}

export default messageController;
