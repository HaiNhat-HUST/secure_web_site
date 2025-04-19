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

  async create(userData) {
    // userData nên chứa các trường đã được chuẩn bị (vd: password đã hash)
    const [newUserId] = await db(TABLE_NAME).insert(userData).returning('user_id'); // returning để lấy ID vừa tạo
    return this.findById(newUserId.user_id || newUserId); // Lấy lại user vừa tạo để trả về đầy đủ thông tin
  },

  async update(userId, updateData) {
    // updateData không nên chứa passwordHash trừ khi đang cập nhật password
    updateData.updated_at = new Date(); // Cập nhật thời gian
    return db(TABLE_NAME).where({ user_id: userId }).update(updateData);
  },

  // Thêm các hàm khác nếu cần (delete, findAll, ...)
};
