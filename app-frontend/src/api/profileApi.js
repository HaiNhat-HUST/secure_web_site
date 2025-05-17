// src/api/profileApi.js
import apiClient from './apiClient'; // apiClient handles token via interceptors

/**
 * Fetches the full profile data for a user, including core user info,
 * detailed profile information, and education history.
 * @param {number} userId - The ID of the user whose profile is to be fetched.
 * @returns {Promise<object>} An object containing user_core, profile_details, and education_history.
 * @throws {Error} If the API call fails or data format is invalid.
 */
export const getUserFullProfile = async (userId) => {
  try {
    // Endpoint might be /api/profiles/:userId/full or just /api/profiles/:userId
    // depending on your backend design.
    // The backend should return a structure like:
    // {
    //   user_core: { user_id, username, email, ... },
    //   profile_details: { first_name, last_name, headline, summary, ... },
    //   education_history: [ { education_id, school_name, degree, ... }, ... ]
    // }
    const response = await apiClient.get(`/api/profiles/${userId}`); // Or your specific "full profile" endpoint

    if (response.data && response.data.user_core && response.data.profile_details) {
      // education_history might be optional if the user hasn't added any
      return {
        user_core: response.data.user_core,
        profile_details: response.data.profile_details,
        education_history: response.data.education_history || [], // Default to empty array
      };
    } else {
      console.error("Invalid data format for full profile:", response.data);
      throw new Error("Invalid data format received from server for full profile.");
    }
  } catch (error) {
    console.error(`Error fetching full profile for user ${userId}:`, error.response?.data || error.message);
    throw error; // Re-throw for Profile.jsx to handle
  }
};

/**
 * Updates the core profile details of a user (data in user_profiles table).
 * @param {number} userId - The ID of the user to update.
 * @param {object} profileDetailsData - The profile details data to update.
 * @returns {Promise<object>} The updated profile details data, potentially with updated user_core.
 * @throws {Error} If the API call fails.
 */
export const updateUserProfileDetails = async (userId, profileDetailsData) => {
  try {
    // Endpoint could be specific like /api/profiles/:userId/details
    // or a general PATCH to /api/profiles/:userId if backend handles it.
    const response = await apiClient.patch(`/api/profiles/${userId}/details`, profileDetailsData);

    // Expecting the API to return the updated profile_details, and possibly user_core if it changed
    if (response.data && response.data.profile_details) {
      return {
          profile_details: response.data.profile_details,
          user_core: response.data.user_core || null // If user_core part of user record was also updated
      };
    } else if (response.data && response.status === 200 && response.data.message) {
      // Handle cases where API only returns a success message
      return { message: response.data.message, needsRefetch: true };
    } else {
      console.error("Invalid data format after updating profile details:", response.data);
      throw new Error("Invalid data format received after updating profile details.");
    }
  } catch (error) {
    console.error(`Error updating profile details for user ${userId}:`, error.response?.data || error.message);
    throw error;
  }
};

// --- Education History CRUD ---

/**
 * Adds a new education entry for a user.
 * @param {number} userId - The ID of the user.
 * @param {object} educationData - The education data to add.
 * @returns {Promise<object>} The newly created education entry.
 * @throws {Error} If the API call fails.
 */
export const addProfileEducation = async (userId, educationData) => {
  try {
    const response = await apiClient.post(`/api/profiles/${userId}/education`, educationData);
    if (response.data && response.data.education_id) { // Assuming API returns the created education item
      return response.data;
    } else {
      console.error("Invalid data format after adding education:", response.data);
      throw new Error("Failed to add education entry or invalid response.");
    }
  } catch (error) {
    console.error(`Error adding education for user ${userId}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Updates an existing education entry for a user.
 * @param {number} userId - The ID of the user.
 * @param {number} educationId - The ID of the education entry to update.
 * @param {object} educationData - The education data to update.
 * @returns {Promise<object>} The updated education entry.
 * @throws {Error} If the API call fails.
 */
export const updateProfileEducation = async (userId, educationId, educationData) => {
  try {
    const response = await apiClient.put(`/api/profiles/${userId}/education/${educationId}`, educationData);
     if (response.data && response.data.education_id) { // Assuming API returns the updated education item
      return response.data;
    } else if (response.data && response.status === 200 && response.data.message) {
      return { message: response.data.message, needsRefetch: true };
    } else {
      console.error("Invalid data format after updating education:", response.data);
      throw new Error("Failed to update education entry or invalid response.");
    }
  } catch (error) {
    console.error(`Error updating education ${educationId} for user ${userId}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Deletes an education entry for a user.
 * @param {number} userId - The ID of the user.
 * @param {number} educationId - The ID of the education entry to delete.
 * @returns {Promise<object>} A success message or an empty object on success.
 * @throws {Error} If the API call fails.
 */
export const deleteProfileEducation = async (userId, educationId) => {
  try {
    const response = await apiClient.delete(`/api/profiles/${userId}/education/${educationId}`);
    // DELETE often returns 204 No Content or a success message
    if (response.status === 204) {
        return { message: "Education entry deleted successfully.", needsRefetch: true };
    } else if (response.data && response.data.message) {
        return { message: response.data.message, needsRefetch: true };
    } else {
      // It's okay if there's no specific data, as long as status is success (e.g. 200, 204)
      // but if there's data and it's not a message, it might be unexpected.
      console.warn("Education deletion response was not empty or a standard message:", response.data);
      return { message: "Deletion processed.", needsRefetch: true };
    }
  } catch (error) {
    console.error(`Error deleting education ${educationId} for user ${userId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Note: The old getUserProfile and updateUserProfile functions are effectively replaced
// by getUserFullProfile and updateUserProfileDetails respectively for the current simplified scope.
// If you need to retain them for other parts of the app, you can, but for this Profile.jsx,
// they are not directly used in the new flow.