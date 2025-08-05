import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Registration = () => {
  const [email, setEmail] = useState(''); // Added email field
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('volunteer'); // Added role state, default to volunteer
  const [message, setMessage] = useState({ error: '', success: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    const allowedEmailCharacters = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if(!allowedEmailCharacters.test(email)){
      newErrors.email = 'Invalid email format or characters.';
    }
    if(!email.trim()) newErrors.email = 'Email is required.';
    if(!password.trim()) newErrors.password = 'Password is required.';
    if(!confirmPassword.trim()) newErrors.confirmPassword = 'Password confirmation is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!validateForm()) return;
    setMessage({ error: '', success: '' }); // Clear previous messages

    if (!email || !password || !confirmPassword || !role) {
      setMessage({ error: 'All fields are required.', success: '' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ error: 'Passwords do not match.', success: '' });
      return;
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword, role }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        setMessage({ success: data.message, error: '' });
        setTimeout(() => navigate('/edit-profile'), 1500);
      } else {
        setMessage({ error: data.message || 'Registration failed.', success: '' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ error: 'An unexpected error occurred. Please try again.', success: '' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Register New Account</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4" noValidate>
          <div>
            <input
              type="email" // Changed to type email
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
          </div>
          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Register as:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
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