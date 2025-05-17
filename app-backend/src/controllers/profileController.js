// src/controllers/profileController.js
const UserModel = require('../models/userModel'); // Or your combined model for profile, education
// If you split models:
// const ProfileModel = require('../models/profileModel');
// const EducationModel = require('../models/educationModel');

// Utility to filter allowed fields (can be moved to a helper file)
const filterAllowedFields = (data, allowedFieldsList) => {
  const filtered = {};
  for (const key in data) {
    if (allowedFieldsList.includes(key)) {
      filtered[key] = data[key];
    }
  }
  return filtered;
};


module.exports = {
  /**
   * Gets the full user profile: core user data, profile details, and education history.
   */
  async getUserFullProfile(req, res, next) {

    console.log(`[Controller] getUserFullProfile called `);

    try {
      const requestedUserId = parseInt(req.params.userId, 10);
      if (isNaN(requestedUserId)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
      }

      // Use the new model method
      const fullProfile = await UserModel.findFullUserProfileById(requestedUserId);

      if (!fullProfile || !fullProfile.user_core) { // user_core must exist if user exists
        return res.status(404).json({ message: 'User profile not found' });
      }

      // No need to filter password_hash here if UserModel.findFullUserProfileById selects carefully
      res.status(200).json(fullProfile); // Send the whole structure

    } catch (error) {
      console.error(`Error in getUserFullProfile for userId ${req.params.userId}:`, error);
      next(error);
    }
  },

  /**
   * Updates the user's profile details (data in user_profiles table).
   */
  async updateUserProfileDetails(req, res, next) {
    try {
      const userIdToUpdate = parseInt(req.params.userId, 10);
      const updateData = req.body;
      const loggedInUser = req.user; // { userID, role } from authenticateJWT

      if (isNaN(userIdToUpdate)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
      }
      if (!loggedInUser || loggedInUser.user_id !== userIdToUpdate) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own profile details' });
      }
      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No update data provided' });
      }

      // Define fields allowed to be updated in user_profiles
      // These should match columns in your 'user_profiles' table
      const allowedProfileDetailFields = [
        'first_name', 'last_name', 'headline', 'summary',
        'current_location_city', 'current_location_country',
        'profile_picture_url', 'cover_image_url',
        'public_email', 'phone_number', 'website_url',
        'linkedin_profile_url', 'github_profile_url'
        // Add any other fields from user_profiles table
      ];
      const filteredData = filterAllowedFields(updateData, allowedProfileDetailFields);

      if (Object.keys(filteredData).length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for update.' });
      }

      // Use the new model method for upserting profile details
      const updatedProfileRows = await UserModel.upsertProfileDetails(userIdToUpdate, filteredData);
      
      if (!updatedProfileRows || updatedProfileRows.length === 0) {
          // This might happen if upsert fails or user_id doesn't exist (though unlikely after auth check)
          return res.status(404).json({ message: 'Profile details not found or could not be updated.' });
      }
      
      // Refetch the core user data if needed, or assume it's unchanged unless specifically updated
      // For now, just return the updated profile details. Frontend might refetch full profile.
      // Or, your upsertProfileDetails could return a combined object if it also updates users table fields.
      
      // To match frontend expectation of { profile_details, user_core (optional) }
      const responsePayload = {
          profile_details: updatedProfileRows[0], // Assuming upsert returns the affected row
          // user_core: could be fetched again or if some user fields are updated along with profile details
      };


      // If first_name or last_name changes, it might affect display_name in users table.
      // You might need an additional UserModel.update for `users` table if `display_name` is a concatenation.
      // Or, AuthContext on frontend could use first_name/last_name from profile_details.
      // For simplicity, we'll assume frontend handles display name composition.
      // OR, your API response could include the updated user_core if updateUserProfileDetails also touches users table.

      res.status(200).json({
        message: 'Profile details updated successfully',
        ...responsePayload // Send back updated profile_details (and user_core if applicable)
      });

    } catch (error) {
      console.error(`Error in updateUserProfileDetails for userId ${req.params.userId}:`, error);
      next(error);
    }
  },


  // --- Education Controllers ---
  async addEducationEntry(req, res, next) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const educationData = req.body;
      const loggedInUser = req.user;

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
      }
      if (!loggedInUser || loggedInUser.user_id !== userId) {
        return res.status(403).json({ message: 'Forbidden: You can only add education to your own profile' });
      }
      if (!educationData || Object.keys(educationData).length === 0) {
        return res.status(400).json({ message: 'No education data provided' });
      }

      // Validate and filter educationData fields
      const allowedEducationFields = [
        'school_name', 'degree', 'field_of_study',
        'start_date', 'end_date', 'description'
      ];
      const filteredData = filterAllowedFields(educationData, allowedEducationFields);
      if (!filteredData.school_name) { // Example: school_name is mandatory
          return res.status(400).json({ message: 'School name is required.' });
      }

      const newEducation = await UserModel.addEducation(userId, filteredData);
      res.status(201).json(newEducation); // Return the created education entry

    } catch (error) {
      console.error(`Error in addEducationEntry for userId ${req.params.userId}:`, error);
      next(error);
    }
  },

  async updateEducationEntry(req, res, next) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const educationId = parseInt(req.params.educationId, 10);
      const educationData = req.body;
      const loggedInUser = req.user;

      if (isNaN(userId) || isNaN(educationId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      if (!loggedInUser || loggedInUser.user_id !== userId) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own education entries' });
      }
      if (!educationData || Object.keys(educationData).length === 0) {
        return res.status(400).json({ message: 'No education data provided for update' });
      }

      // Verify ownership of the education entry before updating
      const existingEducation = await UserModel.findEducationByIdAndUserId(educationId, userId);
      if (!existingEducation) {
        return res.status(404).json({ message: 'Education entry not found or you do not have permission to edit it.' });
      }

      const allowedEducationFields = [
        'school_name', 'degree', 'field_of_study',
        'start_date', 'end_date', 'description'
      ];
      const filteredData = filterAllowedFields(educationData, allowedEducationFields);
      // Add any specific validation for update if needed

      const updatedEducation = await UserModel.updateEducation(educationId, filteredData);
      if (!updatedEducation) {
          return res.status(404).json({ message: 'Education entry not found during update (should not happen if previous check passed)'})
      }
      res.status(200).json(updatedEducation);

    } catch (error) {
      console.error(`Error in updateEducationEntry for eduId ${req.params.educationId}:`, error);
      next(error);
    }
  },

  async deleteEducationEntry(req, res, next) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const educationId = parseInt(req.params.educationId, 10);
      const loggedInUser = req.user;

      if (isNaN(userId) || isNaN(educationId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      if (!loggedInUser || loggedInUser.user_id !== userId) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own education entries' });
      }

      // Verify ownership
      const existingEducation = await UserModel.findEducationByIdAndUserId(educationId, userId);
      if (!existingEducation) {
        return res.status(404).json({ message: 'Education entry not found or you do not have permission to delete it.' });
      }

      await UserModel.deleteEducation(educationId);
      res.status(200).json({ message: 'Education entry deleted successfully' }); // Or 204 No Content

    } catch (error) {
      console.error(`Error in deleteEducationEntry for eduId ${req.params.educationId}:`, error);
      next(error);
    }
  },


  // The old getUserProfile and updateUserProfile methods from your original file
  // are now effectively replaced by getUserFullProfile and updateUserProfileDetails.
  // You can remove them or adapt them if they serve a different purpose.
  // For clarity, I'm commenting them out here. If you need to keep the old updateUserProfile
  // for direct updates to 'users' table, rename it (e.g., updateUserCore) and keep its route.

  /*
  async getUserProfile(req, res, next) { ... old code ... },
  async updateUserProfile(req, res, next) { ... old code ... }
  */

};