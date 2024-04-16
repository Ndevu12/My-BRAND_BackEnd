import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing the structure of a category document.
 */
export interface ICategory extends Document {
    name?: any;
    // blog: string; 
}
        /**
         * Mongoose schema for the Categories collection.
         */
        const categorySchema = new Schema<ICategory>({
            name: {
                type: String,
                required: true,
                unique: true 
            }
        });

// categorySchema.virtual('blogs', {
//     ref: 'Blog',
//     localField: '_id',
//     foreignField: 'category'
// });


        const Category = mongoose.model<ICategory>('Category', categorySchema);

  
export { Category };
