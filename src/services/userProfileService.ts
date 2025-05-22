import { UserProfile } from "../models/userProfile";
import { User } from "../models/user";
import { IUserProfile } from "../models/userProfile";
import mongoose from "mongoose";

class UserProfileService {
  /**
   * Creates a new user profile or gets existing one
   * @param userId The ID of the user to create a profile for
   * @returns The newly created profile
   */
  static async createOrGetProfile(userId: string): Promise<IUserProfile> {
    // Check if profile already exists
    let profile = await UserProfile.findOne({ user: userId });
    
    if (!profile) {
      // If no profile exists, get user data to create one
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error("User not found");
      }
        // Create a new profile based on user data
      profile = await UserProfile.create({
        user: user._id,
        // Initialize with empty values that will be filled in later
        firstName: "",
        lastName: "",
      });
    }
    
    return profile;
  }
  
  /**
   * Get profile by user ID
   * @param userId The ID of the user
   * @returns The user profile if found
   */
  static async getProfileByUserId(userId: string): Promise<IUserProfile | null> {
    return await UserProfile.findOne({ user: userId });
  }
  
  /**
   * Update user profile
   * @param userId The ID of the user
   * @param profileData The profile data to update
   * @returns The updated profile
   */  static async updateProfile(
    userId: string,
    profileData: Partial<Omit<IUserProfile, 'user'>>
  ): Promise<IUserProfile | null> {
    // Create a clean object with only the fields we want to update
    const cleanData: any = {};
      // Only include fields that are present and of the correct type
    if (profileData.firstName !== undefined) cleanData.firstName = profileData.firstName;
    if (profileData.lastName !== undefined) cleanData.lastName = profileData.lastName;
    if (profileData.bio !== undefined) cleanData.bio = profileData.bio;
    if (profileData.avatarUrl !== undefined) cleanData.avatarUrl = profileData.avatarUrl;
    
    // Find and update profile
    const profile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { ...cleanData, updatedAt: new Date() },
      { new: true }
    );
    
    return profile;
  }

  /**
   * Get profile by profile ID
   * @param profileId The ID of the profile
   * @returns The user profile if found
   */  static async getProfileById(profileId: string): Promise<IUserProfile | null> {
    return await UserProfile.findById(profileId);
  }

  /**
   * Delete a user profile
   * @param userId The ID of the user whose profile to delete
   * @returns True if profile was deleted, false if not found
   */
  static async deleteProfile(userId: string): Promise<boolean> {
    const result = await UserProfile.findOneAndDelete({ user: userId });
    return result !== null;
  }
}

export default UserProfileService;
