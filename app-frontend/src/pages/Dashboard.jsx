import RecruiterDashboard from "./RecruiterDashboard";
import CandidateDashboard from "./CandidateDashboard";
import { useAuth } from "../context/AuthContext";


const Dashboard = () => {
    const { currentUser } = useAuth();

    if (!currentUser) return <p>Loading...</p>;
    
    return currentUser.role === "Recruiter" ? <RecruiterDashboard /> : <CandidateDashboard />;
};

export default Dashboard;  