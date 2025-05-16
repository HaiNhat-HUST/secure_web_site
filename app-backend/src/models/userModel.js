// src/models/user.model.js
const db = require('../config/database'); // Import knex instance

const TABLE_NAME = 'users';

module.exports = {
  async findById(userId) {
    return db(TABLE_NAME).where({ user_id: userId }).first(); 
  },

  async findByUsername(username) {
    return db(TABLE_NAME).where({ username: username }).first();
  },

  async findByEmail(email) {
     return db(TABLE_NAME).where({ email: email }).first();
  },

  async findByGoogleId(googleId) {
    return db(TABLE_NAME).where({ google_id: googleId }).first();
  },

  async create(userData) {
    const [newUserId] = await db(TABLE_NAME).insert(userData).returning('user_id');
    return this.findById(newUserId.user_id || newUserId); 
  },

  async update(userId, updateData) {
    
    updateData.updated_at = new Date();
    return db(TABLE_NAME).where({ user_id: userId }).update(updateData).returning('*');
  },

  async updateByEmail(email, updateData) {
    updateData.updated_at = new Date();
    return db(TABLE_NAME).where({ email }).update(updateData).returning('*');
  },

  async createWithGoogle(profileData) {
    const userData = {
      google_id: profileData.id,
      username: profileData.emails[0].value.split('@')[0], // Create username from email
      email: profileData.emails[0].value,
      display_name: profileData.displayName,
      profile_picture: profileData.photos[0].value,
      role: null, // Default role
      password_hash: null, // No password for OAuth users
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return this.create(userData);
  },

  async linkGoogleAccount(email, profileData) {
    const updateData = {
      google_id: profileData.id,
      display_name: profileData.displayName,
      profile_picture: profileData.photos[0].value,
      updated_at: new Date()
    };
    
    return this.updateByEmail(email, updateData);
  },

  async updatePassword(email, password_hash){
     return db(TABLE_NAME).where({ email }).update({password_hash, updated_at: new Date()});
  }

};
