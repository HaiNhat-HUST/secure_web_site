const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('applications').del();
  await knex('job_postings').del();
  await knex('users').del();
  
  // Create users - mixture of job seekers and recruiters
  const users = [];
  const jobSeekers = [];
  const recruiters = [];
  
  // Create 50 users (30 job seekers, 20 recruiters)
  for (let i = 0; i < 50; i++) {
    const isJobSeeker = i < 30;
    const role = isJobSeeker ? 'JobSeeker' : 'Recruiter';
    
    // Determine if user is OAuth or traditional
    const isOAuth = Math.random() > 0.7;
    
    const user = {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password_hash: isOAuth ? null : faker.internet.password(),
      role,
      google_id: isOAuth ? faker.string.uuid() : null,
      display_name: faker.person.fullName(),
      profile_picture: faker.image.avatar(),
      contact_details: JSON.stringify({
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode()
      }),
      resume_data: isJobSeeker ? JSON.stringify({
        education: [
          {
            institution: faker.company.name() + ' University',
            degree: faker.helpers.arrayElement(['Bachelor', 'Master', 'PhD']),
            field: faker.helpers.arrayElement(['Computer Science', 'Business', 'Engineering', 'Mathematics']),
            startDate: faker.date.past({ years: 6 }).toISOString().split('T')[0],
            endDate: faker.date.past({ years: 2 }).toISOString().split('T')[0]
          }
        ],
        experience: [
          {
            company: faker.company.name(),
            position: faker.person.jobTitle(),
            description: faker.lorem.paragraph(),
            startDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
            endDate: faker.date.past({ years: 1 }).toISOString().split('T')[0]
          },
          {
            company: faker.company.name(),
            position: faker.person.jobTitle(),
            description: faker.lorem.paragraph(),
            startDate: faker.date.past({ years: 8 }).toISOString().split('T')[0],
            endDate: faker.date.past({ years: 5 }).toISOString().split('T')[0]
          }
        ],
        skills: Array(5).fill().map(() => faker.person.jobArea())
      }) : null,
      created_at: faker.date.past({ years: 1 }),
      updated_at: faker.date.recent()
    };
    
    users.push(user);
    
    if (isJobSeeker) {
      jobSeekers.push(user);
    } else {
      recruiters.push(user);
    }
  }
  
  // Insert users and store the IDs
  const userIds = await knex('users').insert(users).returning('user_id');
  
  // Map user objects to their IDs
  for (let i = 0; i < users.length; i++) {
    users[i].user_id = userIds[i].user_id;
  }
  
  // Extract job seeker and recruiter IDs
  const jobSeekerIds = users.filter(u => u.role === 'JobSeeker').map(u => u.user_id);
  const recruiterIds = users.filter(u => u.role === 'Recruiter').map(u => u.user_id);
  
  // Create job postings (5-10 per recruiter)
  const jobPostings = [];
  
  for (const recruiterId of recruiterIds) {
    const numJobPostings = faker.number.int({ min: 5, max: 10 });
    
    for (let i = 0; i < numJobPostings; i++) {
      const createdAt = faker.date.past({ years: 1 });
      const status = faker.helpers.arrayElement(['Open', 'Closed', 'Archived']);
      
      const jobPosting = {
        recruiter_id: recruiterId,
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraphs(3),
        location: faker.helpers.arrayElement([
          faker.location.city() + ', ' + faker.location.state(),
          'Remote',
          'Hybrid - ' + faker.location.city()
        ]),
        job_type: faker.helpers.arrayElement(['FullTime', 'PartTime', 'Contract']),
        status,
        closing_date: status === 'Open' 
          ? faker.date.future({ years: 1 }) 
          : faker.date.between({ from: createdAt, to: Date.now() }),
        created_at: createdAt,
        updated_at: faker.date.between({ from: createdAt, to: Date.now() })
      };
      
      jobPostings.push(jobPosting);
    }
  }
  
  // Insert job postings and store the IDs
  const jobPostingIds = await knex('job_postings').insert(jobPostings).returning('job_posting_id');
  
  // Map job posting objects to their IDs
  for (let i = 0; i < jobPostings.length; i++) {
    jobPostings[i].job_posting_id = jobPostingIds[i].job_posting_id;
  }
  
  // Create applications (3-7 per job seeker, randomly distributed across jobs)
  const applications = [];
  const applicationTracker = new Set(); // To prevent duplicates
  
  for (const jobSeekerId of jobSeekerIds) {
    const numApplications = faker.number.int({ min: 3, max: 7 });
    const jobIndices = faker.helpers.arrayElements(
      Array.from({ length: jobPostings.length }, (_, i) => i),
      numApplications
    );
    
    for (const jobIndex of jobIndices) {
      const jobPosting = jobPostings[jobIndex];
      const applicationKey = `${jobSeekerId}-${jobPosting.job_posting_id}`;
      
      // Skip if this application already exists
      if (applicationTracker.has(applicationKey)) {
        continue;
      }
      
      applicationTracker.add(applicationKey);
      
      const submissionDate = faker.date.between({ 
        from: jobPosting.created_at, 
        to: jobPosting.status === 'Open' ? Date.now() : jobPosting.closing_date 
      });
      
      const status = faker.helpers.arrayElement([
        'New', 'UnderReview', 'Shortlisted', 'Rejected', 'Hired', 'InterviewScheduled'
      ]);
      
      // Find the job seeker
      const jobSeeker = users.find(u => u.user_id === jobSeekerId);
      
      const application = {
        job_seeker_id: jobSeekerId,
        job_posting_id: jobPosting.job_posting_id,
        submission_date: submissionDate,
        status,
        resume_snapshot: jobSeeker.resume_data, // Copy of resume at time of application
        created_at: submissionDate,
        updated_at: faker.date.between({ from: submissionDate, to: Date.now() })
      };
      
      applications.push(application);
    }
  }
  
  // Insert applications
  await knex('applications').insert(applications);
  
  console.log(`Seeded ${users.length} users (${jobSeekerIds.length} job seekers, ${recruiterIds.length} recruiters)`);
  console.log(`Seeded ${jobPostings.length} job postings`);
  console.log(`Seeded ${applications.length} applications`);
};