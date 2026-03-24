import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiLock, FiMail, FiLogIn } from 'react-icons/fi';

const LoginPage = ({ setToken }) => {
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
    setError('');  // Reset error before making request

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);  // Set token in parent component's state
        navigate('/dashboard');  // Navigate to the dashboard after successful login
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);  // Stop the loading spinner
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-[400px] glass-card p-8">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-1">
          <span className="text-gradient">ForeSight</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">Authentication Portal</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/40 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-11 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-11 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-4 rounded-xl btn-gradient flex items-center justify-center disabled:opacity-50 font-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Processing...
              </>
            ) : (
              <>
                <FiLogIn className="mr-2 h-5 w-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
          New to ForeSight?{' '}
          <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
    