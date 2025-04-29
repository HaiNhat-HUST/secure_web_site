// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext, useAuth } from '../context/AuthContext'; // <-- Đường dẫn AuthContext
import { getUserProfile, updateUserProfile } from '../api/profileApi'; // <-- Import hàm API
import ProfileDisplay from '../components/Profile/ProfileDisplay'; // <-- Import component hiển thị
import ProfileUpdateForm from '../components/Profile/ProfileUpdateForm'; // <-- Import component form

function Profile() {
  // Sử dụng Context để lấy user và token
  const { currentUser: loggedInUser, token, isAuthenticated, loading, logout, setCurrentUser } = useAuth();

  // State cho dữ liệu profile fetch từ API
  const [profileData, setProfileData] = useState(null);
  // State cho trạng thái loading chung của trang
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // State cho trạng thái loading của việc update
  const [isUpdating, setIsUpdating] = useState(false);
   // State cho thông báo lỗi và thành công
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- Hàm Fetch Profile (sử dụng useCallback để tối ưu) ---
  const fetchProfile = useCallback(async () => {
    if (loggedInUser && loggedInUser.user_id && token) {
      setIsLoadingPage(true);
      setError('');
      try {
        console.log(`Fetching profile for user ID: ${loggedInUser.user_id}`);
        const data = await getUserProfile(loggedInUser.user_id);
        console.log("Profile data received:", data);
        setProfileData(data);
      } catch (err) {
         console.error('Fetch profile error:', err);
        const errorMessage = err.message || err.error || 'Failed to fetch profile.';
        setError(errorMessage);
        // Tự động logout nếu lỗi 401
        if ((err.status === 401 || err.statusCode === 401) && logout) {
          logout();
        }
      } finally {
        setIsLoadingPage(false);
      }
    } else {
       // Nếu không có user hoặc token, không fetch và báo lỗi/chuyển hướng
       console.log("User not authenticated, cannot fetch profile.");
      setError('User not authenticated. Please log in.');
      setIsLoadingPage(false);
    }
  }, [loggedInUser, token, logout]); // Dependencies cho useCallback

  // --- Effect để gọi fetchProfile khi component mount hoặc user/token thay đổi ---
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // Chỉ cần fetchProfile làm dependency vì nó đã có dependencies của nó

  // --- Hàm xử lý khi Form Update được Submit ---
  const handleProfileUpdate = async (updatePayload) => {
     setIsUpdating(true); // Bắt đầu trạng thái loading cho việc update
     setError('');
     setSuccessMessage('');

     if (!loggedInUser || !loggedInUser.user_id || !token) {
         setError("Authentication error.");
         setIsUpdating(false);
         return false; // Báo hiệu thất bại
     }

     try {
        console.log(`Updating profile for user ID: ${loggedInUser.user_id} with payload:`, updatePayload);
        // Gọi hàm API update (token được xử lý bởi interceptor)
        const updatedUser = await updateUserProfile(loggedInUser.user_id, updatePayload);

        console.log("Profile update response:", updatedUser);

        // Xử lý response từ API update
        if (updatedUser && updatedUser.user_id) { // Nếu API trả về user đã cập nhật
            setCurrentUser(updatedUser);
            setProfileData(updatedUser); // Cập nhật state hiển thị
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000); // Xóa thông báo sau 3s
            return true; // Báo hiệu thành công
        } else if (updatedUser && updatedUser.message) { // Nếu API chỉ trả về message
             setSuccessMessage(updatedUser.message);
             // Có thể cần gọi lại fetchProfile nếu API không trả về user mới
             if (updatedUser.needsRefetch) {
                 await fetchProfile(); // Gọi lại để lấy data mới nhất
             }
             setTimeout(() => setSuccessMessage(''), 3000);
             return true;
        } else {
            // Trường hợp không mong muốn
             throw new Error("Received unexpected response after update.");
        }

     } catch (err) {
        console.error('Update profile error:', err);
        const errorMessage = err.message || err.error || 'Failed to update profile.';
        setError(errorMessage);
        setTimeout(() => setError(''), 5000); // Xóa lỗi sau 5s
        return false; // Báo hiệu thất bại
     } finally {
        setIsUpdating(false); // Kết thúc trạng thái loading update
     }
  };

  // --- Render Logic ---
  if (isLoadingPage) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  // Hiển thị lỗi nếu không fetch được profile ban đầu VÀ không có profileData
  if (error && !profileData) {
     return (
        <div className="flex flex-col justify-center items-center h-screen text-red-500">
            <p>{error}</p>
            {/* Có thể thêm nút thử lại hoặc nút logout */}
            {logout && <button onClick={logout} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600">Logout</button>}
        </div>
    );
  }

  // Trường hợp chưa đăng nhập hoặc context chưa sẵn sàng
  if (!loggedInUser) {
       return <div className="flex justify-center items-center h-screen">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-700">
      {/* Hiển thị thông báo lỗi/thành công toàn cục */}
       {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-4 mt-4 rounded" role="alert">{successMessage}</div>}
       {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-4 mt-4 rounded" role="alert">{error}</div>}


      {/* Phần hiển thị profile */}
      <ProfileDisplay profileData={profileData} />

      {/* Phần form cập nhật */}
      <ProfileUpdateForm
          initialData={profileData} // Truyền dữ liệu profile hiện tại
          onSubmit={handleProfileUpdate} // Truyền hàm xử lý khi form submit
          isUpdating={isUpdating} // Truyền trạng thái loading của việc update
      />

       {/* Nút Logout */}
{/*       {logout && (
           <div className="text-center py-6">
               <button onClick={logout} className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                   Logout
               </button>
           </div>
       )}*/}
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setUser({
        backgroundImage: "/hero-img.png",
        imageUrl: "/team-1.png",
        altText: "Mia Taylor",
        name: "Mia Taylor",
        location: "New York City, NY",
        jobTitle: "Director - Museum of Modern Art",
        description: "🎨 Art enthusiast creating vibrant masterpieces!",
      });
    }, 1000);
  }, []);

  return <Profile user={user} />;
}