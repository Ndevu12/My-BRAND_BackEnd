import { IUser, User } from "../models/user";

class UserServices {
  /**
   * Find a user by username, email, or password
   */
  static async findUserByCredentials(username: string, email?: string): Promise<IUser | null> {
    const query = email 
      ? { $or: [{ username }, { email }] }
      : { username };
    
    const user = await User.findOne(query);
    return user;
  }

  /**
   * Find a user by their ID
   */
  static async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    return user;
  }

  /**
   * Create a new user
   */
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = await User.create(userData);
    return user;
  }

  /**
   * Find user by login credentials
   */
  static async findUserByLogin(username: string): Promise<IUser | null> {
    const user = await User.findOne({ username });
    return user;
  }

  /**
   * Get all users (for admin purposes)
   */
  static async getAllUsers(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }

  /**
   * Delete all users (for testing/cleanup)
   */
  static async deleteAll(): Promise<any> {
    const deleteThem = await User.deleteMany();
    return deleteThem;
  }
}

export default UserServices;
