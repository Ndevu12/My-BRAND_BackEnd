/**
 * This file deals with storing and handling Analytics information.
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing the structure of an Analytics document.
 */
export interface IAnalytics extends Document {
    mostViewedBlog: string[];
    mostLikedBlog: string[];
    mostSharedBlog: string[];
    visitors: number;
    subscribers: number;
    spaceStatus: string;
    dateRange: Date;
}

class Analytics {

    private readonly model: mongoose.Model<IAnalytics>;

    constructor(){
/**
 * Mongoose schema for the Analytics collection.
 */
const analyticsSchema = new Schema<IAnalytics>({
    mostViewedBlog: {
        type: [String],
        default: [],
    },
    mostLikedBlog: {
        type: [String],
        default: [],
    },
    mostSharedBlog: {
        type: [String],
        default: [],
    },
    visitors: {
        type: Number,
        default: 0,
    },
    subscribers: {
        type: Number,
        default: 0,
    },
    spaceStatus: {
        type: String,
        default: 'active',
    },
    dateRange: {
        type: Date,
        required: true,
    },
});
this.model = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
}

// Method to create a new Analytics document
public async  createAnalytics(data: Partial<IAnalytics | any >): Promise<IAnalytics> {
    return await this.model.create(data);
}

// Method to find a Analytics document by ID
public findAnalyticsById(id: string): Promise<IAnalytics | null> {
    return this.model.findById(id).exec();
}

// Method to update a Analytics document
public updateAnalytics(id: string, data: Partial<IAnalytics>): Promise<IAnalytics | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
}

// Method to delete a Analytics document
public deleteAnalytics(id: string): Promise<IAnalytics | null> {
    return this.model.findByIdAndDelete(id).exec();
}

  /**
 * Method to find all Analytics documents.
 * @returns Promise resolving to an array of all Analytics documents.
 */
  public async getAllAnalyticss(): Promise<IAnalytics[]> {
    return this.model.find().exec();
}

 public async deletemany(): Promise<any> {
    return await this.model.deleteMany().exec();
 }

}

// Create and export Analytics model
export default new Analytics();
