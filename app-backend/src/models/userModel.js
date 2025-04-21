// src/models/user.model.js
const db = require('../config/database'); // Import knex instance

const TABLE_NAME = 'users';

module.exports = {
  async findById(userId) {
    return db(TABLE_NAME).where({ user_id: userId }).first(); // .first() để lấy 1 bản ghi hoặc undefined
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
    // userData nên chứa các trường đã được chuẩn bị (vd: password đã hash)
    const [newUserId] = await db(TABLE_NAME).insert(userData).returning('user_id'); // returning để lấy ID vừa tạo
    return this.findById(newUserId.user_id || newUserId); // Lấy lại user vừa tạo để trả về đầy đủ thông tin
  },

  async update(userId, updateData) {
    // updateData không nên chứa passwordHash trừ khi đang cập nhật password
    updateData.updated_at = new Date(); // Cập nhật thời gian
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
      role: 'JobSeeker', // Default role
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

  // Thêm các hàm khác nếu cần (delete, findAll, ...)
};
