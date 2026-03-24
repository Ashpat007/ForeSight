import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const Signup = ({ setToken }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-md w-full glass-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
             <span className="text-gradient">Create Account</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Join the ForeSight network</p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/40 text-sm font-semibold">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-widest ml-1" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="name"
                type="text"
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-widest ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-widest ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type="password"
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full btn-gradient py-4 px-4 rounded-xl flex items-center justify-center font-bold transition-all duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <FiLogIn className="mr-2 h-5 w-5" />
            )}
            Sign Up Now
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm font-medium">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
