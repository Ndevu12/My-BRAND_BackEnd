import { Request, Response } from "express";
import blogCategoryService from "../services/blogCategoryService.ts";
import BlogServices from "../services/blogService.ts";
import MessageService from "../services/messageService.ts";
import UserServices from "../services/userServices.ts";
import { Comment } from "../models/comments.ts";

class reset {
  // static resetSetting(req: Request, res: Response): Promise<void> {
  static resetSetting() {
    var AuthorResetMessage: string;
    var BlogCategoryResetMessage: string;
    var blogResetMessage: string;
    var commentResetMessage: string;
    var messageResetMessage: string;
    var UserResetMessage: string;
    var packageData: any;
    try {
      const resetBlogCategory = blogCategoryService.deletemany();
      if (!resetBlogCategory) {
        BlogCategoryResetMessage = "No data reset";
      } else {
        BlogCategoryResetMessage = "All data reset successfully";
      }
      const resetBlog = BlogServices.deleteAllBlogs();
      if (!resetBlog) {
        blogResetMessage = "No data reset";
      } else {
        blogResetMessage = "All data reset successfully";
      }
      const resetComment = Comment.deleteMany();
      if (!resetComment) {
        commentResetMessage = "No data reset";
      } else {
        commentResetMessage = "All data reset successfully";
      }
      const resetMessage = MessageService.deletemany();
      if (!resetMessage) {
        messageResetMessage = "No data reset";
      } else {
        messageResetMessage = "All data reset successfully";
      }
      const resetUser = UserServices.deleteAll();
      if (!resetUser) {
        UserResetMessage = "No data reset";
      } else {
        UserResetMessage = "All data reset successfully";
      }
      packageData = {
        BlogCategoryResetMessage,
        blogResetMessage,
        commentResetMessage,
        messageResetMessage,
        UserResetMessage,
      };
      console.log(packageData);
      // res.status(200).json(packageData);
    } catch (err) {
      console.log(packageData);
      // res.status(500).json({
      //   packageData,
      //   err,
      // });
    }

    return Promise.resolve();
  }
}

export default reset;
