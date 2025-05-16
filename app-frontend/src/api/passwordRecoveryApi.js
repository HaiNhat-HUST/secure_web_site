import apiClient from './apiClient';

/**
 * Request a password reset by providing an email
 * @param {string} email - User's email address
 * @returns {Promise} - API response
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to request password reset' };
  }
};

/**
 * Reset password using token and new password
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @returns {Promise} - API response
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post('/reset-password', { 
      token, 
      password: newPassword, 
    });
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || { message: 'Failed to reset password' };
  }
};

