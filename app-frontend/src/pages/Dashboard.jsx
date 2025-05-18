import React from 'react'; 
import RecruiterDashboard from "./RecruiterDashboard";
import CandidateDashboard from "./CandidateDashboard";
import { useAuth } from "../context/AuthContext"; 

const Dashboard = () => {
    const { currentUser, loading } = useAuth(); 

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading User Data...</p></div>;
    }
    
    if (!currentUser) {
        return <div className="flex justify-center items-center h-screen"><p className="text-xl">Authenticating...</p></div>;
    }
    
    return currentUser.role === "Recruiter" ? <RecruiterDashboard /> : <CandidateDashboard />;
};

export default Dashboard;  