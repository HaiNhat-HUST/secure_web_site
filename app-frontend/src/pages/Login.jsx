import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded mb-3"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded mb-3"
      />
      <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Login
      </button>
      <p className="text-center mt-3">
        Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
      </p>
    </div>
  );
};

export default Login;
