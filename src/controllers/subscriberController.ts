import { Request, Response } from "express";
import subscriberUtils from "../utils/subscriberUtilities";
import { ISubscriber } from "../models/Subscriber";
import SubscriberService from "../services/subscriberService";
import { sign } from "../helpers/jwtToken";
import response from "../helpers/response";

class subscriberController {
  /**
   * Method to create a new subscriber.
   * @param req Request object containing subscriber data.
   * @param res Response object to send the result.
   */
  static async createSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const subscriberData: ISubscriber = req.body;
      const { email } = req.body;

      // Check if subscriber with the same email already exists
      const existingSubscriber = await SubscriberService.findSubscriberByEmail(
        subscriberData
      );
      if (existingSubscriber) {
        res
          .status(400)
          .json({ message: "Subscriber with this email already exists" });
        console.error("Error fetching subscribers: /already subscribed");
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

      response(res, 200, "Subscribed successful", userObject);
    } catch (error) {
      console.error("Error creating subscriber:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  /**
   * Method to retrieve all subscribers.
   * @param req Request object.
   * @param res Response object to send the subscribers.
   */
  static async getAllSubscribers(req: Request, res: Response): Promise<void> {
    try {
      const subscribers = await SubscriberService.getAllSubscribers();
      res.status(200).json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  /**
   * Method to retrieve a subscriber by its ID.
   * @param req Request object containing the subscriber ID.
   * @param res Response object to send the subscriber.
   */
  static async getSubscriberById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const subscriber = await SubscriberService.findSubscriberById(id);
      if (subscriber) {
        res.status(200).json(subscriber);
      } else {
        res.status(404).send("Subscriber not found");
      }
    } catch (error) {
      console.error("Error fetching subscriber by ID:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  /**
   * Method to update a subscriber by its ID.
   * @param req Request object containing the subscriber ID and updated data.
   * @param res Response object to send the updated subscriber.
   */
  static async updateSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedSubscriberData = req.body;
      const updatedSubscriber = await SubscriberService.updateSubscriber(
        id,
        updatedSubscriberData
      );
      if (updatedSubscriber) {
        res.status(200).json(updatedSubscriber);
      } else {
        res.status(404).send("Subscriber not found");
      }
    } catch (error) {
      console.error("Error updating subscriber:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  /**
   * Method to delete a subscriber by its ID.
   * @param req Request object containing the subscriber ID.
   * @param res Response object to send the result.
   */
  static async deleteSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedSubscriber = await SubscriberService.deleteSubscriber(id);
      if (deletedSubscriber) {
        res.status(200).send("Subscriber deleted successfully");
      } else {
        res.status(404).send("Subscriber not found");
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default subscriberController;
