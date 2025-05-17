// src/pages/Profile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// API Functions
import {
  getUserFullProfile,       // Assumes this fetches user_core, profile_details, and education_history
  updateUserProfileDetails,
  addProfileEducation,
  updateProfileEducation,
  deleteProfileEducation
} from '../api/profileApi'; // Ensure these are correctly implemented

// Modal Form Components
import ProfileDetailsFormModal from '../components/Profile/Forms/ProfileDetailsFormModal';
import EducationFormModal from '../components/Profile/Forms/EducationFormModal';

// Example Icons (replace with your icon library)
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.096 3.222.261m3.222.261L12 5.82_8_6.73L12 5.82_16_6.73" /></svg>;


function Profile() {
  const {
    currentUser: loggedInUser,
    loading: authLoading,
    logout,
    setCurrentUser
  } = useAuth();
  const navigate = useNavigate();
  const { userId: routeUserIdParam } = useParams();

  const [profileData, setProfileData] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [targetUserId, setTargetUserId] = useState(null);
  const [viewingOwnProfile, setViewingOwnProfile] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      const routeUserId = routeUserIdParam ? parseInt(routeUserIdParam) : null;
      if (routeUserId) {
        setTargetUserId(routeUserId);
        setViewingOwnProfile(loggedInUser?.user_id === routeUserId);
      } else if (loggedInUser) {
        setTargetUserId(loggedInUser.user_id);
        setViewingOwnProfile(true);
      } else {
        setIsLoadingPage(false);
        setError("Please log in to view your profile or specify a user to view.");
      }
    }
  }, [routeUserIdParam, loggedInUser, authLoading, navigate]);

  const fetchFullProfile = useCallback(async () => {
    if (!targetUserId) return;
    setIsLoadingPage(true);
    setError('');
    try {
      // This API call should now fetch users, user_profiles, and education_history
      const data = await getUserFullProfile(targetUserId);
      setProfileData(data);
    } catch (err) {
      console.error('Fetch full profile error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile.';
      setError(errorMessage);
      if (err.response?.status === 401 && logout) logout();
      if (err.response?.status === 404) setError(`Profile not found for user ID ${targetUserId}.`);
    } finally {
      setIsLoadingPage(false);
    }
  }, [targetUserId, logout]);

  useEffect(() => {
    if (targetUserId) fetchFullProfile();
  }, [targetUserId, fetchFullProfile]);

  const [modalState, setModalState] = useState({ section: null, item: null, action: null });
  const openModal = (section, action = 'edit', item = null) => {
    if (!viewingOwnProfile) return;
    setModalState({ section, item, action });
    setError('');
  };
  const closeModal = () => setModalState({ section: null, item: null, action: null });

  const handleSave = async (section, data, itemId = null, currentAction = 'update') => {
    if (!viewingOwnProfile || !loggedInUser) {
      setError("Not authorized."); return false;
    }
    setIsUpdating(true); setError(''); setSuccessMessage('');
    let success = false;
    try {
      let apiResponse;
      switch (section) {
        case 'profileDetails':
          apiResponse = await updateUserProfileDetails(loggedInUser.user_id, data);
          if (apiResponse?.user_core) { // Adjust based on your API response for updating context
            setCurrentUser(prev => ({ ...prev, ...apiResponse.user_core, profile_details: apiResponse.profile_details }));
          }
          break;
        case 'education':
          if (currentAction === 'add') apiResponse = await addProfileEducation(loggedInUser.user_id, data);
          else if (currentAction === 'edit' && itemId) apiResponse = await updateProfileEducation(loggedInUser.user_id, itemId, data);
          else if (currentAction === 'delete' && itemId) apiResponse = await deleteProfileEducation(loggedInUser.user_id, itemId);
          break;
        default: throw new Error("Unknown section.");
      }
      await fetchFullProfile(); // Refetch for simplicity
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} ${currentAction === 'edit' ? 'updated' : currentAction}d.`);
      setTimeout(() => setSuccessMessage(''), 3000);
      closeModal(); success = true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to ${currentAction} ${section}.`;
      setError(errorMessage); success = false;
    } finally {
      setIsUpdating(false);
    }
    return success;
  };

  // --- Inlined Section Render Functions ---
  const renderProfileHeader = () => {
    if (!profileData?.profile_details || !profileData?.user_core) return null;
    const { first_name, last_name, headline, profile_picture_url, cover_image_url, current_location_city, current_location_country } = profileData.profile_details;
    const { username, role } = profileData.user_core;

    // Helper for badge styling based on role
    const getRoleBadgeStyle = (userRole) => {
        if (userRole === 'Recruiter') {
          return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200";
        }
        if (userRole === 'JobSeeker') {
          return "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200";
        }
        return "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"; // Default
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
        <div className="h-48 bg-gray-300 dark:bg-gray-700 bg-cover bg-center" style={{ backgroundImage: `url(${cover_image_url || '/placeholder-cover.jpg'})` }}></div>
        <div className="p-6 sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center sm:space-x-5">
            <img className="block h-24 w-24 rounded-full ring-4 ring-white dark:ring-gray-900 mx-auto sm:mx-0 sm:shrink-0" src={profile_picture_url || '/placeholder-avatar.png'} alt={`${first_name} ${last_name}`} />
            <div className="mt-4 text-center sm:mt-0 sm:text-left">
              <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{first_name || ''} {last_name || username}</p>
                {role && ( // Badge below name
                <div className="mt-1">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getRoleBadgeStyle(role)}`}>
                        {role}
                    </span>
                </div>
                )}

              {headline && <p className={`text-sm font-medium text-gray-600 dark:text-gray-400 ${role ? 'mt-1' : 'mt-0' }`}>{headline}</p>}
{/*              {
                  (current_location_city || current_location_country) && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">{current_location_city}{current_location_city && current_location_country ? ', ' : ''}{current_location_country}</p>
                  )
              } 
*/}              
              {
                  (current_location_city || current_location_country) && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                    {current_location_city}{current_location_city && current_location_country ? ', ' : ''}{current_location_country}
                </p>
                  )
              }

            </div>
          </div>
          {viewingOwnProfile && (
            <button
              onClick={() => openModal('profileDetails', 'edit', profileData.profile_details)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <PencilIcon /> <span className="ml-2">Edit Profile</span>
            </button>
          )}
        </div>
      </div>
    );
    };

  const renderAboutSection = () => {
    if (!profileData?.profile_details) return null;
    const { summary } = profileData.profile_details;
    return (
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 my-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About</h2>
          {viewingOwnProfile && (
            <button onClick={() => openModal('profileDetails', 'edit', profileData.profile_details)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              <PencilIcon />
            </button>
          )}
        </div>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{summary || (viewingOwnProfile ? 'Add a summary to tell your story.' : 'No summary provided.')}</p>
      </div>
    );
  };

  const renderEducationSection = () => {
    const educationHistory = profileData?.education_history || [];
     return (
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 my-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
          {viewingOwnProfile && (
            <button onClick={() => openModal('education', 'add')} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              <PlusIcon /> <span className="ml-1">Add</span>
            </button>
          )}
        </div>
        {educationHistory.length > 0 ? (
          <ul className="space-y-6">
            {educationHistory.map(edu => (
              <li key={edu.education_id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{edu.school_name}</h3>
                    <p className="text-md text-gray-700 dark:text-gray-300">{edu.degree}{edu.field_of_study ? `, ${edu.field_of_study}`:''}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {edu.start_date ? new Date(edu.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : ''}
                      {edu.end_date ? ` - ${new Date(edu.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}` : (edu.start_date ? ' - Present' : '')}
                    </p>
                    {edu.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{edu.description}</p>}
                  </div>
                   {viewingOwnProfile && (
                    <div className="flex space-x-2 ml-2 shrink-0">
                      <button onClick={() => openModal('education', 'edit', edu)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"><PencilIcon /></button>
                      <button
                        onClick={() => { if (window.confirm('Are you sure you want to delete this education entry?')) { handleSave('education', null, edu.education_id, 'delete'); }}}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                        disabled={isUpdating}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500 dark:text-gray-400">{viewingOwnProfile ? 'Add your education details.' : 'No education listed.'}</p>}
      </div>
    );
  };

  // --- Main Render Logic ---
  if (authLoading && isLoadingPage) return <div className="flex justify-center items-center h-screen">Authenticating...</div>;
  if (isLoadingPage) return <div className="flex justify-center items-center h-screen">Loading profile...</div>;

  if (error && !profileData && !isUpdating) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <p>{error}</p>
        {targetUserId && <button onClick={fetchFullProfile} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">Try Again</button>}
        {loggedInUser && viewingOwnProfile && logout && <button onClick={logout} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600">Logout</button>}
        {!loggedInUser && <button onClick={() => navigate('/login')} className="mt-4 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600">Login</button>}
      </div>
    );
  }
  if (!profileData && !isLoadingPage && !error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p>Profile not found or not accessible.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-10">
      {successMessage && <div className="fixed top-5 right-5 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg" role="alert">{successMessage}</div>}
      {error && !modalState.section && <div className="fixed top-5 right-5 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg" role="alert">{error}</div>}

      {profileData && (
        <div className="container mx-auto px-2 sm:px-4 pt-8 max-w-4xl">
          {renderProfileHeader()}
          {renderAboutSection()}
          {renderEducationSection()}
        </div>
      )}

      {/* Modals - Render based on modalState */}
      {viewingOwnProfile && modalState.section && (
        <>
          {modalState.section === 'profileDetails' && (
            <ProfileDetailsFormModal isOpen={true} initialData={modalState.item} onSave={(data) => handleSave('profileDetails', data, null, 'edit')} onClose={closeModal} isUpdating={isUpdating} apiError={error}/>
          )}
          {modalState.section === 'education' && (
            <EducationFormModal isOpen={true} initialData={modalState.action === 'edit' ? modalState.item : null} onSave={(data) => handleSave('education', data, modalState.item?.education_id, modalState.action)} onClose={closeModal} isUpdating={isUpdating} apiError={error}/>
          )}
          {/* No Experience or Skills modal rendering */}
        </>
      )}
    </div>
  );
}

export default Profile;