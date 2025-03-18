import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-2 border rounded mb-3"
      />
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
      <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
        Register
      </button>
      <p className="text-center mt-3">
        Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  );
};

export default Register;
