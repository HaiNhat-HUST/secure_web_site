exports.up = async function(knex) {
  // 1. Tạo bảng 'users'
  await knex.schema.createTable('users', function(table) {
    table.increments('user_id').primary();
    table.string('username', 255).notNullable().unique();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).nullable(); // Changed to nullable for OAuth users
    table.enu('role', ['JobSeeker', 'Recruiter', 'Administrator']).notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);

    // OAuth fields
    table.string('google_id', 255).nullable().unique();
    table.string('display_name', 255).nullable();
    table.string('profile_picture', 2000).nullable();

    table.text('contact_details').nullable();
    table.specificType('skills', 'TEXT[]').nullable();
    table.string('resume_data').nullable();

    table.string('department', 255).nullable(); // Thuộc tính của Recruiter

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // 2. Tạo bảng 'job_postings'
  await knex.schema.createTable('job_postings', function(table) {
    table.increments('job_posting_id').primary();
    table.integer('recruiter_id').unsigned().notNullable();
    table.foreign('recruiter_id').references('user_id').inTable('users').onDelete('CASCADE');

    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.string('location', 255);
    table.enu('job_type', ['FullTime', 'PartTime', 'Contract']).notNullable();
    table.enu('status', ['Open', 'Closed', 'Archived']).notNullable().defaultTo('Open');
    table.timestamp('posting_date', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('closing_date', { useTz: true }).nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // 3. Tạo bảng 'applications'
  await knex.schema.createTable('applications', function(table) {
    table.increments('application_id').primary();
    table.integer('job_seeker_id').unsigned().notNullable();
    table.foreign('job_seeker_id').references('user_id').inTable('users').onDelete('CASCADE');

    table.integer('job_posting_id').unsigned().notNullable();
    table.foreign('job_posting_id').references('job_posting_id').inTable('job_postings').onDelete('CASCADE');

    table.timestamp('submission_date', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.enu('status', ['New', 'UnderReview', 'Shortlisted', 'Rejected', 'Hired', 'InterviewScheduled']).notNullable().defaultTo('New');
    table.text('resume_snapshot').nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.unique(['job_seeker_id', 'job_posting_id']);
  });
};

// Đừng quên thêm hàm xuống để xóa bảng khi cần (ví dụ trong trường hợp lùi lại migration)
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('applications');
  await knex.schema.dropTableIfExists('job_postings');
  await knex.schema.dropTableIfExists('users');
};
