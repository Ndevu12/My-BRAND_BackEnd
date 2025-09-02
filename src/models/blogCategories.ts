import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing the structure of a category document.
 */
export interface ICategory extends Document {
    name: string;
    icon?: string;
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
            },
            icon: {
                type: String,
                required: false,
                default: null
            }
        }, {
            timestamps: true // This will add createdAt and updatedAt automatically
        });

// categorySchema.virtual('blogs', {
//     ref: 'Blog',
//     localField: '_id',
//     foreignField: 'category'
// });


        const Category = mongoose.model<ICategory>('Category', categorySchema);

  
export { Category };
