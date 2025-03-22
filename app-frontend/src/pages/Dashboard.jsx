import RecruiterDashboard from "./RecruiterDashboard";
import CandidateDashboard from "./CandidateDashboard";
import { useAuth } from "../context/AuthContext";


// handle dashboard based on role
// implement latter with login function and backend
// rename some component 
const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return <p>Loading...</p>;

    return user.role === "recruiter" ? <RecruiterDashboard /> : <CandidateDashboard />;
};

export default Dashboard;