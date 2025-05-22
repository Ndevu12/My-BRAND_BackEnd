import { Request, Response } from 'express';
import UserProfileService from '../services/userProfileService';
import { CustomeRequest } from '../middlewares/authUtils';
import response from '../helpers/response';
import cloudinary from '../helpers/cloudinary';
import { validateUserProfile, sanitizeProfileData } from '../helpers/validators/userProfileValidator';
import mongoose from 'mongoose';

class UserProfileController {
  /**
   * Get the current user's profile
   * @param req Express request object
   * @param res Express response object
   */  static async getMyProfile(req: CustomeRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        response(res, 401, "Unauthorized. Please login first.", null, "UNAUTHORIZED");
        return;
      }

      const userId = req.user.id;
      const profile = await UserProfileService.getProfileByUserId(userId);
      
      if (!profile) {
        response(res, 404, "Profile not found", null, "PROFILE_NOT_FOUND");
        return;
      }
      
      response(res, 200, "Profile retrieved successfully", profile);
    } catch (error: any) {
      console.error("Error retrieving profile:", error);
      response(res, 500, "Error retrieving profile", null, error.message);
    }
  }
  
  /**
   * Create or update the current user's profile
   * @param req Express request object
   * @param res Express response object
   */  static async updateMyProfile(req: CustomeRequest & { file?: Express.Multer.File }, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        response(res, 401, "Unauthorized. Please login first.", null, "UNAUTHORIZED");
        return;
      }

      const userId = req.user.id;
        // Prepare profile data with the body values
      const rawProfileData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bio: req.body.bio
      };
      
      // Sanitize and validate the profile data
      const profileData = sanitizeProfileData(rawProfileData);
      
      // Validate profile data
      const { error } = validateUserProfile(profileData);
      if (error) {
        response(res, 400, error.message, null, "VALIDATION_ERROR");
        return;
      }
      
      // Handle avatar url if provided
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path);
          profileData.avatarUrl = result.secure_url;
        } catch (uploadError) {
          response(res, 500, "Error uploading avatar", null, "UPLOAD_ERROR");
          return;
        }
      }
      
      // Update or create profile
      let profile;
      try {
        profile = await UserProfileService.getProfileByUserId(userId);
        
        if (!profile) {
          profile = await UserProfileService.createOrGetProfile(userId);
        }
        
        profile = await UserProfileService.updateProfile(userId, profileData);
        
        if (!profile) {
          response(res, 404, "Failed to update profile", null, "UPDATE_FAILED");
          return;
        }
        
        response(res, 200, "Profile updated successfully", profile);
      } catch (error: any) {
        response(res, 500, "Error updating profile", null, error.message);
      }
    } catch (error: any) {
      console.error("Error in profile update:", error);
      response(res, 500, "Server error", null, "SERVER_ERROR");
    }
  }
  
  /**
   * Get a public profile by user ID
   * @param req Express request object
   * @param res Express response object
   */  static async getPublicProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        response(res, 400, "User ID is required", null, "INVALID_REQUEST");
        return;
      }

    //   Validate userID's format 
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        response(res, 400, "Invalid user ID format", null, "INVALID_USER_ID");
        return;
      }
      
      const profile = await UserProfileService.getProfileByUserId(userId);
      
      if (!profile) {
        response(res, 404, "Profile not found", null, "PROFILE_NOT_FOUND");
        return;
      }
      
      response(res, 200, "Profile retrieved successfully", profile);
    } catch (error: any) {
      console.error("Error retrieving public profile:", error);
      response(res, 500, "Error retrieving profile", null, error.message);
    }
  }

  /**
   * Delete the current user's profile
   * @param req Express request object
   * @param res Express response object
   */
  static async deleteMyProfile(req: CustomeRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        response(res, 401, "Unauthorized. Please login first.", null, "UNAUTHORIZED");
        return;
      }

      const userId = req.user.id;
      
      const result = await UserProfileService.deleteProfile(userId);
      
      if (!result) {
        response(res, 404, "Profile not found", null, "PROFILE_NOT_FOUND");
        return;
      }
      
      response(res, 200, "Profile deleted successfully", null);
    } catch (error: any) {
      console.error("Error deleting profile:", error);
      response(res, 500, "Error deleting profile", null, error.message);
    }
  }
}

export default UserProfileController;
