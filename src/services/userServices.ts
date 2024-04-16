import { IUser, User } from "../models/user";

type QueryType = { $or: [{ username: string }, { passward: string }] };

class UserServices {
  static async getSingleUser(query: QueryType): Promise<IUser | null> {
    const user = await User.findOne(query);
    return user;
  }

  static async userSignup(userData: IUser): Promise<IUser> {
    const user = await User.create(userData);
    user.save();
    return user;
  }
  static async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    return user;
  }
}

export default UserServices;
