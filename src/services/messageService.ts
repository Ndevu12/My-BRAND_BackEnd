import { IMessage, Message } from "../models/messages";
import { IMessageCreateData } from "../types/message.types";
import mongoose, { Types } from "mongoose";

class MessageService {
  static async deletemany() {
    const deleteMessage = await Message.deleteMany();
    return deleteMessage;
  }  /**
   * Method to create a new Message document.
   * @param data Message data to create.
   * @returns Promise resolving to the created Message document.
   */
  static async createMessage(data: IMessageCreateData): Promise<IMessage> {
    const message = new Message(data);
    return await message.save();
  }

  static async getAllMessages(queryParams: {
    page?: number;
    limit?: number;
    status?: 'all' | 'read' | 'unread';
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<{
    messages: IMessage[];
    paginations:{
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }> {
    const { page = 1, limit = 10, status = 'all', search = '', sortBy = 'createdAt', order = 'desc' } = queryParams;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;
    const filter: any = {};

    // Filter by status if not 'all'
    if (status !== 'all') {
      filter.isRead = status === 'read';
    }

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Validate sort field
    const validSortFields = ['name', 'email', 'subject', 'createdAt'];
    if (!validSortFields.includes(sortBy)) {
      throw new Error("Invalid sort field");
    }

    // Validate sort order
    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(order)) {
      throw new Error("Invalid sort order. Use 'asc' or 'desc'");
    }

    // Perform the query with pagination, filtering, and sorting
    const messages = await Message.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    return {
      messages,
      paginations: {
        total: await Message.countDocuments(filter).exec(),
        page,
        limit,
        totalPages: Math.ceil(await Message.countDocuments(filter).exec() / limit)
      }
    };
  }

  /**
   * Method to find a Message document by ID.
   * @param id Message ID.
   * @returns Promise resolving to the found Message document, or null if not found.
   */
  static async findMessageById(id: string): Promise<IMessage | null> {
    const messages = await Message.findById(id).exec();
    return messages;
  }

  static async deleteMessage(messageId: string): Promise<IMessage | null> {
    const message = await Message.findByIdAndDelete(messageId);
    return message;
  }

  /**
   * Method to mark a message as read.
   * @param messageId Message ID.
   * @returns Promise resolving to the updated Message document, or null if not found.
   */
  static async markAsRead(messageId: string): Promise<IMessage | null> {
    if (Types.ObjectId.isValid(messageId) === false) {
      return null;
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );
    return message;
  }
}

export default MessageService;
