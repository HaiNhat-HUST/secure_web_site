// src/components/Profile/ProfileDisplay.jsx
import React from 'react';

function ProfileDisplay({ profileData }) {
  if (!profileData) {
    return <div className="text-center p-10">No profile data available.</div>;
  }

  const displayName = profileData.username || 'N/A';
  const displayEmail = profileData.email || 'N/A';
  const displayRole = profileData.role || 'N/A';
  const imageUrl = profileData.profile_picture || '/img/placeholder-avatar.png'; // Cần ảnh placeholder
  const backgroundImage = '/img/profile-background.jpg'; // Ảnh nền cố định

  return (
    <main className="profile-page">
      {/* Phần ảnh nền */}
      <section className="relative block h-52 md:h-64 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <span className="absolute w-full h-full bg-black opacity-50"></span>
      </section>

      {/* Phần nội dung chính */}
      <section className="relative bg-gray-100 dark:bg-gray-800 py-8 md:py-16">
        <div className="container mx-auto px-4">
          {/* Card chứa thông tin */}
          <div className="relative flex flex-col min-w-0 break-words bg-white dark:bg-gray-900 w-full mb-6 shadow-xl rounded-lg -mt-48 md:-mt-64">
            <div className="px-6">
              {/* Avatar */}
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <img
                      alt={`${displayName} profile`}
                      src={imageUrl}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
                    />
                  </div>
                </div>
                {/* Các nút hoặc khoảng trống bên cạnh avatar */}
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  {/* <div className="py-6 px-3 mt-32 sm:mt-0">
                    <button className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                      Connect
                    </button>
                  </div> */}
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                   {/* Có thể thêm thống kê nếu cần */}
                </div>
              </div>

              {/* Thông tin cơ bản */}
              <div className="text-center mt-16 md:mt-24">
                <h3 className="text-2xl md:text-3xl font-semibold leading-normal mb-2 text-gray-800 dark:text-gray-200">
                  {displayName}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 dark:text-gray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500 dark:text-gray-400"></i>
                  {/* Cần lấy location từ contact_details hoặc trường riêng */}
                  Location Placeholder, USA
                </div>
                 <div className="mb-2 text-gray-700 dark:text-gray-300 mt-6 md:mt-10">
                  <i className="fas fa-briefcase mr-2 text-lg text-gray-500 dark:text-gray-400"></i>
                  Role: {displayRole}
                </div>
                <div className="mb-2 text-gray-700 dark:text-gray-300">
                  <i className="fas fa-envelope mr-2 text-lg text-gray-500 dark:text-gray-400"></i>
                  Email: {displayEmail}
                </div>
              </div>

              {/* Phần mô tả và chi tiết */}
              <div className="mt-6 md:mt-10 py-6 md:py-10 border-t border-gray-300 dark:border-gray-700 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                     {/* Contact Details */}
                    {profileData.contact_details && (
                      <p className="mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-300">
                         <strong className="font-semibold">Contact:</strong> {profileData.contact_details}
                      </p>
                    )}
                    {/* Department (for Recruiter) */}
                     {profileData.role === 'Recruiter' && profileData.department && (
                       <p className="mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-300">
                          <strong className="font-semibold">Department:</strong> {profileData.department}
                       </p>
                     )}
                      {/* Skills (for JobSeeker) */}
                     {profileData.role === 'JobSeeker' && profileData.skills && profileData.skills.length > 0 && (
                       <div className="mb-4">
                         <strong className="font-semibold text-gray-800 dark:text-gray-300">Skills:</strong>
                         <div className="flex flex-wrap justify-center mt-2">
                           {profileData.skills.map((skill, index) => (
                             <span key={index} className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-indigo-600 bg-indigo-200 dark:bg-indigo-800 dark:text-indigo-300 uppercase last:mr-0 mr-1 mb-1">
                               {skill}
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                     {/* Resume Data (for JobSeeker) */}
                     {profileData.role === 'JobSeeker' && profileData.resume_data && (
                       <p className="mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-300">
                          <strong className="font-semibold">Resume/CV:</strong> {profileData.resume_data} {/* Có thể hiển thị link nếu là URL */}
                       </p>
                     )}

                    {/* Description/About Me (nếu có trường này) */}
                    {/* <p className="mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-300">
                      An artist of considerable range...
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProfileDisplay; // Export component con