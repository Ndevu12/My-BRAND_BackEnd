import { IMessage, Message } from "../models/messages.ts";

class MessageService {

    /**
     * Method to create a new Message document.
     * @param data Partial Message data to create.
     * @returns Promise resolving to the created Message document.
     */
  static async createMessage(data: IMessage): Promise<IMessage> {
    return (await Message.create(data)).save();
}

  static async getAllMessages(): Promise<IMessage[]> {
    const messages = await Message.find();
    return messages;
  }

/**
 * Method to find a Message document by ID.
 * @param id Message ID.
 * @returns Promise resolving to the found Message document, or null if not found.
 */
static async findMessageById(id: string): Promise<IMessage | null> {
  return await Message.findById(id).exec();
}


  static async deleteMessage(messageId: string): Promise<IMessage | null> {
    const message = await Message.findByIdAndDelete(messageId);
    return message;
  }
}

export default MessageService;