import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ error: '', success: '' });
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      setMessage({ error: 'All fields are required.', success: '' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ error: 'Passwords do not match.', success: '' });
      return;
    }

    setTimeout(() => {
      setMessage({ success: 'Registration successful! Redirecting to login...', error: '' });
      setTimeout(() => navigate('/login'), 1500);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Register New Account</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login Here
          </Link>
        </p>
        {message.error && (
          <p className="mt-4 text-sm text-red-600 text-center">{message.error}</p>
        )}
        {message.success && (
          <p className="mt-4 text-sm text-green-600 text-center">{message.success}</p>
        )}
      </div>
    </div>
  );
};

export default Registration;
