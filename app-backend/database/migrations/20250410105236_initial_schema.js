exports.up = async function(knex) {
  // 1. Tạo bảng 'users'
  await knex.schema.createTable('users', function(table) {
    table.increments('user_id').primary();
    table.string('username', 255).notNullable().unique();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).nullable(); // Nullable for OAuth users
    table.enu('role', ['JobSeeker', 'Recruiter']).nullable();

    // OAuth fields
    table.string('google_id', 255).nullable().unique();
    table.string('display_name', 255).nullable();
    table.string('profile_picture', 2000).nullable();

    table.text('contact_details').nullable();
    table.text('resume_data').nullable();

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('user_profiles', function(table) {
    table.increments('profile_id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .unique() // Enforces one-to-one relationship
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE') // If user is deleted, profile is deleted
      .onUpdate('CASCADE');

    table.string('first_name', 100).nullable();
    table.string('last_name', 100).nullable();
    table.string('headline', 255).nullable(); // e.g., "Software Engineer at XYZ"
    table.text('summary').nullable(); // The "About" section
    table.string('current_location_city', 255).nullable();
    table.string('current_location_country', 255).nullable();
    table.string('profile_picture_url', 2000).nullable(); // User's main, curated profile picture
    table.string('cover_image_url', 2000).nullable(); // LinkedIn-style cover image

    // Contact Details (more structured)
    table.string('public_email', 255).nullable(); // Different from login email potentially
    table.string('phone_number', 50).nullable();
    table.string('website_url', 2000).nullable();
    table.string('linkedin_profile_url', 2000).nullable();
    table.string('github_profile_url', 2000).nullable();
    // Add other social links as needed (twitter_url, etc.)

    table.timestamps(true, true);
  });

  await knex.schema.createTable('education_history', function(table) { // Renamed for clarity
    table.increments('education_id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.string('school_name', 255).notNullable();
    table.string('degree', 255).nullable(); // e.g., Bachelor's, Master's
    table.string('field_of_study', 255).nullable();
    table.date('start_date').nullable();
    table.date('end_date').nullable(); // Null if currently studying
    table.text('description').nullable(); // Activities, societies, grade, etc.

    table.timestamps(true, true);
    table.index('user_id');
  });

  // 2. Tạo bảng 'job_postings'
  await knex.schema.createTable('job_postings', function(table) {
    table.increments('job_posting_id').primary();
    table.integer('recruiter_id').unsigned().notNullable()
          .references('user_id').inTable('users').onDelete('CASCADE');

    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.string('location', 255);
    table.enu('job_type', ['FullTime', 'PartTime', 'Contract']).notNullable();
    table.enu('status', ['Open', 'Closed', 'Archived']).notNullable().defaultTo('Open');

    table.timestamp('closing_date', { useTz: true }).nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // 3. Tạo bảng 'applications'
  await knex.schema.createTable('applications', function(table) {
    table.increments('application_id').primary();
    table.integer('job_seeker_id').unsigned().notNullable()
          .references('user_id').inTable('users').onDelete('CASCADE');

    table.integer('job_posting_id').unsigned().notNullable()
          .references('job_posting_id').inTable('job_postings').onDelete('CASCADE');

    table.timestamp('submission_date', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.enu('status', ['New', 'UnderReview', 'Shortlisted', 'Rejected', 'Hired', 'InterviewScheduled'])
         .notNullable()
         .defaultTo('New');
    table.text('resume_snapshot').nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.unique(['job_seeker_id', 'job_posting_id']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('applications');
  await knex.schema.dropTableIfExists('job_postings');
  await knex.schema.dropTableIfExists('user_profiles');
  await knex.schema.dropTableIfExists('users');
};
