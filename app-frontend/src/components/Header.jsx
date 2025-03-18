import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 shadow-lg flex justify-between items-center">
      <Link to="/"><h1 className="text-xl font-bold">EmployMee</h1></Link>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/login" className="hover:text-gray-400">Login</Link></li>
          <li><Link to="/login" className="hover:text-gray-400">Jobs</Link></li>
          <li><Link to="/login" className="hover:text-gray-400">Dashboard</Link></li>
          <li><Link to="/login" className="hover:text-gray-400">My Profile</Link></li>
        </ul>
      </nav>
    </header>
  );
}
