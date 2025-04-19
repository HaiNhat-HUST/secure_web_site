// src/test/test_db.js

// Quan trọng: Script này sẽ chạy với cấu hình 'development' trong knexfile.js
// và tương tác trực tiếp với database development của bạn!
// Đảm bảo database development (trong Docker hoặc cài trực tiếp) đang chạy.

const UserModel = require('..\\models\\user.model'); // Đường dẫn đúng đến model
const db = require('..\\config\\database'); // Import knex instance (sẽ dùng config 'development')

async function runManualModelTests() {
  console.log('--- Starting Manual Model Tests (on Development DB!) ---');

  try {
    // --- Test create ---
    console.log('\n[TEST] Creating a new user...');
    const uniqueSuffix = Date.now();
    const testUsername = `manual_user_${uniqueSuffix}`;
    const testEmail = `manual_${uniqueSuffix}@test.com`;
    const userData = {
      username: testUsername,
      email: testEmail,
      password_hash: 'manual_hashed_pw', // Cần hash thật ở service, đây chỉ là test model
      role: 'JobSeeker'
    };
    const createdUser = await UserModel.create(userData);
    if (!createdUser || !createdUser.user_id) {
      console.error('[FAIL] User creation failed or did not return user ID.');
    } else {
      console.log('[PASS] User created successfully:', createdUser);
      const createdUserId = createdUser.user_id;

      // --- Test findById (chỉ chạy nếu create thành công) ---
      console.log(`\n[TEST] Finding user by ID: ${createdUserId}...`);
      const foundById = await UserModel.findById(createdUserId);
      if (!foundById || foundById.user_id !== createdUserId) {
        console.error(`[FAIL] Could not find user by ID ${createdUserId} or ID mismatch.`);
      } else {
        console.log('[PASS] Found user by ID:', foundById);
      }

      // --- Test findByUsername ---
      console.log(`\n[TEST] Finding user by Username: ${testUsername}...`);
      const foundByUsername = await UserModel.findByUsername(testUsername);
      if (!foundByUsername || foundByUsername.username !== testUsername) {
        console.error(`[FAIL] Could not find user by username ${testUsername} or username mismatch.`);
      } else {
        console.log('[PASS] Found user by username:', foundByUsername);
      }

       // --- Test findByEmail ---
       console.log(`\n[TEST] Finding user by Email: ${testEmail}...`);
       const foundByEmail = await UserModel.findByEmail(testEmail);
       if (!foundByEmail || foundByEmail.email !== testEmail) {
           console.error(`[FAIL] Could not find user by email ${testEmail} or email mismatch.`);
       } else {
           console.log('[PASS] Found user by email:', foundByEmail);
       }


      // --- Test update ---
      console.log(`\n[TEST] Updating user ID: ${createdUserId}...`);
      const updateData = { contact_details: 'Manual Test Contact', is_active: false };
      const affectedRows = await UserModel.update(createdUserId, updateData);
      if (affectedRows !== 1) {
        console.error(`[FAIL] Update did not affect 1 row (affected: ${affectedRows}).`);
      } else {
        const updatedUser = await UserModel.findById(createdUserId); // Kiểm tra lại
        if (!updatedUser || updatedUser.contact_details !== 'Manual Test Contact' || updatedUser.is_active !== false) {
          console.error('[FAIL] User data was not updated correctly after update call.');
          console.log('Updated User Data:', updatedUser);
        } else {
          console.log('[PASS] User updated successfully. New data:', updatedUser);
        }
      }

      // --- Test findById for non-existent user ---
      console.log('\n[TEST] Finding non-existent user by ID...');
      const nonExistentUser = await UserModel.findById(999999); // ID không tồn tại
      if (nonExistentUser !== undefined) {
          console.error('[FAIL] Finding non-existent user should return undefined, but got:', nonExistentUser);
      } else {
          console.log('[PASS] Finding non-existent user correctly returned undefined.');
      }

    } // Kết thúc khối kiểm tra sau khi create thành công

  } catch (error) {
    console.error('\n---! TEST ENCOUNTERED AN ERROR !---');
    console.error(error);
  } finally {
    // Rất quan trọng: Đảm bảo đóng kết nối DB sau khi chạy xong
    console.log('\nClosing database connection...');
    await db.destroy();
    console.log('Database connection closed.');
    console.log('--- Manual Model Tests Finished ---');
  }
}

// Chạy hàm test
runManualModelTests();