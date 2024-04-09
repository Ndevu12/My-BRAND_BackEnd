// var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
//     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
//     return new (P || (P = Promise))(function (resolve, reject) {
//         function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
//         function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
//         function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
//         step((generator = generator.apply(thisArg, _arguments || [])).next());
//     });
// };

import ProfileModel from '../models/profile.js';

class ProfileController {
    /**
     * Method to create a new profile.
     * @param req Request object containing profile data.
     * @param res Response object to send the result.
     */
    async createProfile(req, res) {
            try {
                const profileData = req.body;
                const newProfile = await ProfileModel.createProfile(profileData);
                res.status(201).json(newProfile);
            }
            catch (error) {
                console.error('Error creating profile:', error);
                res.status(500).send('Internal Server Error');
            }

    }
    /**
     * Method to retrieve all profiles.
     * @param req Request object.
     * @param res Response object to send the profiles.
     */
    async getAllProfiles(req, res) {
            try {
                const profiles = await ProfileModel.getAllProfiles();
                res.status(200).json(profiles);
            }
            catch (error) {
                console.error('Error fetching profiles:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }

    }
    /**
     * Method to retrieve a profile by its ID.
     * @param req Request object containing the profile ID.
     * @param res Response object to send the profile.
     */
    async getProfileById(req, res) {
            try {
                const { id } = req.params;
                const profile = await ProfileModel.findProfileById(id);
                if (profile) {
                    res.status(200).json(profile);
                }
                else {
                    res.status(404).json({ error: 'Profile not found' });
                }
            }
            catch (error) {
                console.error('Error fetching profile by ID:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }

    }
    /**
     * Method to update a profile by its ID.
     * @param req Request object containing the profile ID and updated data.
     * @param res Response object to send the updated profile.
     */
    async updateProfile(req, res) {
            try {
                const { id } = req.params;
                const updatedProfileData = req.body;
                const updatedProfile = await ProfileModel.updateProfile(id, updatedProfileData);
                if (updatedProfile) {
                    res.status(200).json(updatedProfile);
                }
                else {
                    res.status(404).json({ error: 'Profile not found' });
                }
            }
            catch (error) {
                console.error('Error updating profile:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }

    }
    /**
     * Method to delete a profile by its ID.
     * @param req Request object containing the profile ID.
     * @param res Response object to send the result.
     */
    async deleteProfile(req, res) {
            try {
                const { id } = req.params;
                const deletedProfile = await ProfileModel.deleteProfile(id);
                if (deletedProfile) {
                    res.status(200).json({ message: 'Profile deleted successfully' });
                }
                else {
                    res.status(404).json({ error: 'Profile not found' });
                }
            }
            catch (error) {
                console.error('Error deleting profile:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }

    }
}
// hijokl
export default ProfileController;
