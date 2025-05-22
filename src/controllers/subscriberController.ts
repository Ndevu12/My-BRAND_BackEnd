import { Request, Response } from "express";
// import subscriberUtils from "../utils/subscriberUtilities";
import { ISubscriber } from "../models/Subscriber";
import SubscriberService from "../services/subscriberService";
import { sign } from "../helpers/jwtToken";
import response from "../helpers/response";

class subscriberController {  /**
   * Method to create a new subscriber.
   * @param req Request object containing subscriber data.
   * @param res Response object to send the result.
   */
  static async createSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const subscriberData: ISubscriber = req.body;
      const { email } = req.body;      // Check if subscriber with the same email already exists
      const existingSubscriber = await SubscriberService.findSubscriberByEmail(
        subscriberData
      );
      if (existingSubscriber) {
        console.error("Error fetching subscribers: /already subscribed");
        response(res, 400, "Subscriber with this email already exists", null, "SUBSCRIBER_EXISTS");
        return;
      }

      const newSubscriber = await SubscriberService.createSubscriber(
        subscriberData
      );

      const token = sign({
        id: newSubscriber._id,
        email: newSubscriber.email,
        role: newSubscriber.role,
      });
      const userObject = newSubscriber.toObject();
      userObject.accessToken = token;

      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      /**
       * Notify subscribers
       */
      // await subscriberUtils.notifySubscriberOnSubscription(email);

      response(res, 200, "Subscribed successful", userObject);    } catch (error) {
      console.error("Error creating subscriber:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }
  /**
   * Method to retrieve all subscribers.
   * @param req Request object.
   * @param res Response object to send the subscribers.
   */  static async getAllSubscribers(req: Request, res: Response): Promise<void> {
    try {
      const subscribers = await SubscriberService.getAllSubscribers();
      response(res, 200, "Subscribers retrieved successfully", subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }
  /**
   * Method to retrieve a subscriber by its ID.
   * @param req Request object containing the subscriber ID.
   * @param res Response object to send the subscriber.
   */  static async getSubscriberById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const subscriber = await SubscriberService.findSubscriberById(id);
      if (subscriber) {
        response(res, 200, "Subscriber retrieved successfully", subscriber);
      } else {
        response(res, 404, "Subscriber not found", null, "SUBSCRIBER_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error fetching subscriber by ID:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }
  /**
   * Method to update a subscriber by its ID.
   * @param req Request object containing the subscriber ID and updated data.
   * @param res Response object to send the updated subscriber.
   */  static async updateSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedSubscriberData = req.body;
      const updatedSubscriber = await SubscriberService.updateSubscriber(
        id,
        updatedSubscriberData
      );
      if (updatedSubscriber) {
        response(res, 200, "Subscriber updated successfully", updatedSubscriber);
      } else {
        response(res, 404, "Subscriber not found", null, "SUBSCRIBER_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error updating subscriber:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }
  /**
   * Method to delete a subscriber by its ID.
   * @param req Request object containing the subscriber ID.
   * @param res Response object to send the result.
   */  static async deleteSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedSubscriber = await SubscriberService.deleteSubscriber(id);
      if (deletedSubscriber) {
        response(res, 200, "Subscriber deleted successfully", null);
      } else {
        response(res, 404, "Subscriber not found", null, "SUBSCRIBER_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }
}

export default subscriberController;
