/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};

// database/migrations/<timestamp>_remove_oauth_fields_and_closing_date.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Xóa cột khỏi bảng 'users'
  await knex.schema.alterTable('users', function(table) {
    // Liệt kê các cột cần xóa trong bảng users
    table.dropColumn('is_active');
    table.dropColumn('skills');
    table.dropColumn('department');
    // Lưu ý: Cột password_hash bạn đã đổi thành nullable, nếu xóa OAuth
    // bạn có thể muốn tạo migration khác để đổi nó về notNullable nếu cần.
    // Hoặc làm luôn trong migration này:
    // table.string('password_hash', 255).notNullable().alter(); // Đổi lại thành NOT NULLABLE
  });

  // Xóa cột khỏi bảng 'job_postings'
  await knex.schema.alterTable('job_postings', function(table) {
    // Liệt kê các cột cần xóa trong bảng job_postings
    table.dropColumn('posting_date');

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Thêm lại cột vào bảng 'job_postings' trước (ngược thứ tự drop)
  await knex.schema.alterTable('job_postings', function(table) {
    // Thêm lại cột closing_date với định nghĩa ban đầu
    table.timestamp('posting_date', { useTz: true }).nullable();
    // Thêm lại các cột khác nếu có
  });
};