// src/models/userModel.js
const db = require('../config/database'); // Your Knex instance

TABLE_NAME = "users"

module.exports = {
  // ... your existing findById, findByEmail, create, update for 'users' table ...

  async findById(user_id) {
    return db(TABLE_NAME).where({ user_id: user_id }).first(); // .first() để lấy 1 bản ghi hoặc undefined
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

  async update(user_id, updateData) {
    // updateData không nên chứa passwordHash trừ khi đang cập nhật password
    updateData.updated_at = new Date(); // Cập nhật thời gian
    return db(TABLE_NAME).where({ user_id: user_id }).update(updateData).returning('*');
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

  async findFullUserProfileById(user_id) {
    console.log(`[Model] findFullUserProfileById called for userId: ${user_id}`);
    const userCore = await db('users')
      .where('users.user_id', user_id)
      .select('users.user_id', 'users.username', 'users.email', 'users.role', /* other fields */)
      .first();
    console.log(`[Model] user_core result for userId ${user_id}:`, userCore);

    if (!userCore) {
      console.log(`[Model] No user_core found for userId ${user_id}, returning null.`);
      return null; // Important: if userCore is not found, the whole profile is effectively not found
    }

    const profileDetails = await db('user_profiles')
      .where('user_id', user_id)
      .first();
    console.log(`[Model] profile_details for userId ${user_id}:`, profileDetails);

    const educationHistory = await db('education_history')
      .where('user_id', user_id)
      .orderBy('start_date', 'desc');
    console.log(`[Model] education_history for userId ${user_id}:`, educationHistory);

    return {
      user_core: userCore,
      profile_details: profileDetails || {},
      education_history: educationHistory || [],
    };
  },

  async upsertProfileDetails(user_id, detailsData) {
    // 'upsert' = update if exists, insert if not
    // Ensure detailsData only contains columns from 'user_profiles' table
    const existingProfile = await db('user_profiles').where({ user_id: user_id }).first();
    if (existingProfile) {
      return db('user_profiles')
        .where({ user_id: user_id })
        .update({ ...detailsData, updated_at: db.fn.now() }) // Ensure updated_at is set
        .returning('*'); // Return the updated row(s)
    } else {
      return db('user_profiles')
        .insert({ user_id, ...detailsData }) // Ensure created_at, updated_at are handled by DB default or here
        .returning('*');
    }
  },

  // --- Education Model Methods (could be in educationModel.js) ---
  async addEducation(user_id, educationData) {
    console.log(`[Model] addEducation called for userId: ${user_id}`);
    // Ensure educationData only contains columns from 'education_history'
    return db('education_history')
      .insert({ user_id, ...educationData })
      .returning('*') // Return the newly created item
      .then(rows => rows[0]); // Knex insert returning '*' gives an array
  },

  async updateEducation(educationId, educationData) {
    // Ensure educationData only contains columns from 'education_history'
    // IMPORTANT: Ensure userId check happens in controller to prevent updating other users' education
    return db('education_history')
      .where({ education_id: educationId })
      .update({ ...educationData, updated_at: db.fn.now() })
      .returning('*')
      .then(rows => rows[0]);
  },

  async deleteEducation(educationId) {
    // IMPORTANT: Ensure userId check happens in controller
    return db('education_history')
      .where({ education_id: educationId })
      .del();
  },

  async findEducationByIdAndUserId(educationId, user_id) {
    // Helper to check ownership before update/delete
    return db('education_history')
      .where({ education_id: educationId, user_id: user_id })
      .first();
  }
};