/**
 * Controller for handling Message-related operations.
 */
import { Request, Response } from "express";
import MessageService from "../services/messageService";
import response from "../helpers/response";
import { IMessageCreateData } from "../types/message.types";

class messageController {  /**
   * Method to create a new MessageService
   * @param req Request object containing message data.
   * @param res Response object to send the result.
   */  
  static async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const messageData: IMessageCreateData = req.body;
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
        const queryParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as "all" | "read" | "unread" || "all",
        search: req.query.search as string,
        sortBy: req.query.sortBy as string || 'createdAt',
        order: req.query.sortOrder as 'asc' | 'desc' || 'desc',
      };

      // Validate pagination parameters
      if (queryParams.limit <= 0 || queryParams.limit > 50) {
        response(res, 400, "Limit must be between 1 and 50", null, "INVALID_LIMIT");
        return;
      }

      if (queryParams.page <= 0) {
        response(res, 400, "Page must be greater than 0", null, "INVALID_PAGE");
        return;
      }      
      
      // Validate sort parameters
      const validSortFields = ['createdAt', 'updatedAt'];
      if (!validSortFields.includes(queryParams.sortBy)) {
        response(res, 400, "Invalid sort field", null, "INVALID_SORT_FIELD");
        return;
      }

      const validSortOrders = ['asc', 'desc', 'name A-Z'];
      if (!validSortOrders.includes(queryParams.order)) {
        response(res, 400, "Invalid sort order. Use 'asc' or 'desc'", null, "INVALID_SORT_ORDER");
        return;
      }


      const messages = await MessageService.getAllMessages(queryParams);
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
   */  
  static async deleteMessage(req: Request, res: Response): Promise<void> {
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

  /**
   * Method to mark a message as read.
   * @param req Request object containing the message ID.
   * @param res Response object to send the result.
   */
  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedMessage = await MessageService.markAsRead(id);
      if (updatedMessage) {
        response(res, 200, "Message marked as read successfully", updatedMessage);
        return;
      } else {
        if (updatedMessage === null) {
          response(res, 400, "Invalid message ID", null, "INVALID_MESSAGE_ID");
          return;
        }
        response(res, 404, "Message not found", null, "MESSAGE_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }
}

export default messageController;
