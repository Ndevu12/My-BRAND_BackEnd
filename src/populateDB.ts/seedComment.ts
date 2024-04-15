
import { Comment } from '../models/comments.ts';



const seedComment = async () => {
    try {
        const CommentData = [
            { post_ID: '121' },
            { commenterName: 'Button' },
            { comment: 'button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that' },
        ];

        await Comment.insertMany(CommentData);

        console.log('Comment seeded successfully!');
    } catch (error) {
        console.error('Error seeding Comment:', error);
    }
};

// Seed Comment
export { seedComment };
