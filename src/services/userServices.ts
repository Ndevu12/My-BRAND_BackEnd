import { generate } from "../helpers/cryptoJs";
import { IUser, User } from "../models/user";

type QueryType = { $or: [{ username: string }, { passward: string }] };

class UserServices {
  static async getSingleUser(query: QueryType): Promise<IUser | null> {
    const user = await User.findOne(query);
    return user;
  }

  static async userSignup(userData: IUser): Promise<IUser> {
    const strongPassward = await generate(userData.password);
    
    userData.password = strongPassward;
    const user = await User.create(userData);
    user.save();
    return user;
  }

  static async getUserByUsername(username: string): Promise<IUser | any> { 
    const user = await User.findOne({ username: username });
    return user;
  }
  
  static async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    return user;
  }

  static async deleteAll(): Promise<any>{
    const deleteThem = await User.deleteMany();
    return deleteThem;
  }
}

export default UserServices;
