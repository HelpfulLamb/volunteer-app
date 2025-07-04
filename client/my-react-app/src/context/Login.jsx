import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ error: '', success: '' });
  const navigate = useNavigate();

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem('user'));
  //   if(storedUser && storedUser.role){
  //     navigate(storedUser.role === 'admin' ? '/create-event' : '/profile');
  //   }
  // }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password){
      setMessage({ error: 'Email and password are required.', success: '' });
      return;
    }

    // I will replace this with proper user data once we get a backend and DB
    const mockUser = {
      name: role === 'admin' ? 'Admin User' : 'Volunteer User',
      email,
      role
    };
    setTimeout(() => {
      setMessage({ success: 'Login Successful!', error: '' });
      login(mockUser);
      if(role === 'admin'){
        navigate('/create-event');
      } else if(role === 'volunteer'){
        navigate('/profile');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Login to Your Account</h1>
        {!role ? (
          <div className="flex flex-col gap-4">
            <button onClick={() => setRole('volunteer')} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Volunteer Login</button>
            <button onClick={() => setRole('admin')} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">Admin Login</button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition">Login</button>
            </form>
            <button onClick={() => setRole(null)} className="mt-4 text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </>
        )}
        {!role && (<p className="mt-6 text-sm text-center text-gray-600">New User?{" "}<Link to="/registration" className="text-blue-600 hover:underline">Register Here</Link></p>)}
        {message.error && (<p className="mt-4 text-sm text-red-600 text-center">{message.error}</p>)}
        {message.success && (<p className="mt-4 text-sm text-green-600 text-center">{message.success}</p>)}
      </div>
    </div>
  );
};

export default Login;