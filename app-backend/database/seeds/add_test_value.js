exports.seed = async function(knex) {
  // Clear existing data
  await knex('applications').del();
  await knex('job_postings').del();
  await knex('users').del();

  // Insert users: 2 recruiters (id 1 and 2), 1 job seeker (id 3)
  const users = await knex('users')
    .insert([
      {
        username: 'recruiter1',
        email: 'recruiter1@example.com',
        password_hash: 'hashed_password_1',
        role: 'Recruiter',
        contact_details: 'Contact details for recruiter1',
        resume_data: null,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
      {
        username: 'recruiter2',
        email: 'recruiter2@example.com',
        password_hash: 'hashed_password_2',
        role: 'Recruiter',
        contact_details: 'Contact details for recruiter2',
        resume_data: null,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
      {
        username: 'jobseeker1',
        email: 'jobseeker1@example.com',
        password_hash: 'hashed_password_3',
        role: 'JobSeeker',
        contact_details: 'Contact details for jobseeker1',
        resume_data: 'Resume data for jobseeker1',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      }
    ])
    .returning(['user_id', 'role']);

  const recruiters = users.filter(u => u.role === 'Recruiter');
  const jobSeeker = users.find(u => u.role === 'JobSeeker');

  // Insert job postings and get their IDs
  const jobPostings = await knex('job_postings')
    .insert([
      {
        recruiter_id: recruiters[0].user_id,
        title: 'Job Title 1',
        description: 'Job description for job 1',
        location: 'Location 1',
        job_type: 'FullTime',
        status: 'Open',
        closing_date: knex.fn.now(),
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
      {
        recruiter_id: recruiters[1].user_id,
        title: 'Job Title 2',
        description: 'Job description for job 2',
        location: 'Location 2',
        job_type: 'PartTime',
        status: 'Closed',
        closing_date: knex.fn.now(),
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
      {
        recruiter_id: recruiters[0].user_id,
        title: 'Job Title 3',
        description: 'Job description for job 3',
        location: 'Location 3',
        job_type: 'Contract',
        status: 'Open',
        closing_date: knex.fn.now(),
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      }
    ])
    .returning('job_posting_id');

  // Insert applications using correct job_posting_ids
  await knex('applications').insert([
    {
      job_seeker_id: jobSeeker.user_id,
      job_posting_id: jobPostings[0].job_posting_id,
      submission_date: knex.fn.now(),
      status: 'New',
      resume_snapshot: 'Resume snapshot for application 1',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      job_seeker_id: jobSeeker.user_id,
      job_posting_id: jobPostings[1].job_posting_id,
      submission_date: knex.fn.now(),
      status: 'Shortlisted',
      resume_snapshot: 'Resume snapshot for application 2',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      job_seeker_id: jobSeeker.user_id,
      job_posting_id: jobPostings[2].job_posting_id,
      submission_date: knex.fn.now(),
      status: 'UnderReview',
      resume_snapshot: 'Resume snapshot for application 3',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    }
  ]);
};
