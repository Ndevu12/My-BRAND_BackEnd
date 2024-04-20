import { Comment } from "../models/comments";

const seedComment = async () => {
  try {
    const CommentData = {
      postID: "661cd4e528e17db0050a873e",
      commenterName: "Nahayo",
      comment:
        "button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that",
    };

    await Comment.insertMany(CommentData);

    const CommentDatas = {
      postID: "661cd4e528e17db0050a873e",
      commenterName: "Nahayo Ndimoneza",
      comment:
        "button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that",
    };

    await Comment.insertMany(CommentDatas);

    console.log("Comment seeded successfully!");
  } catch (error) {
    console.error("Error seeding Comment:", error);
  }
};

// Seed Comment
export { seedComment };
