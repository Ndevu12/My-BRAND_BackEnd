import { Subscriber, ISubscriber } from "../models/Subscriber";

class SubscriberService {
  /**
   * Method to create a new Subscriber document.
   * @param data Partial Subscriber data to create.
   * @returnsawait Promise resolving to the created Subscriber document.
   */
  static async createSubscriber(data: ISubscriber): Promise<ISubscriber> {
    return await Subscriber.create(data);
  }

  /**
   * Method to find an Subscriber document by ID.
   * @param id Subscriber ID.
   * @returnsawait Promise resolving to the found Subscriber document, or null if not found.
   */
  static async findSubscriberById(id: string): Promise<ISubscriber | null> {
    return await Subscriber.findById(id).exec();
  }

  static async findSubscriberByEmail(
    data: ISubscriber
  ): Promise<ISubscriber | null> {
    return await Subscriber.findOne({ email: data.email }).exec();
  }

  /**
   * Method to update an Subscriber document.
   * @param id Subscriber ID to update.
   * @param data Partial Subscriber data to update.
   * @returnsawait Promise resolving to the updated Subscriber document, or null if not found.
   */
  static async updateSubscriber(
    id: string,
    data: ISubscriber
  ): Promise<ISubscriber | null> {
    return await Subscriber.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Method to delete an Subscriber document.
   * @param id Subscriber ID to delete.
   * @returnsawait Promise resolving to the deleted Subscriber document, or null if not found.
   */
  static async deleteSubscriber(id: string): Promise<ISubscriber | null> {
    return await Subscriber.findByIdAndDelete(id).exec();
  }

  /**
   * Method to find all Subscriber documents.
   * @returnsawait Promise resolving to an array of all Subscriber documents.
   */
  static async getAllSubscribers(): Promise<ISubscriber[]> {
    return await Subscriber.find().exec();
  }

  static async deletemany(): Promise<void | any> {
    return await Subscriber.deleteMany().exec();
  }
}

export default SubscriberService;
