import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn, useAuth } from '@clerk/clerk-react';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (authLoaded && isSignedIn) {
      navigate('/');
    }
  }, [authLoaded, isSignedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!signInLoaded) return;
      
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        // Navigation will be handled by the useEffect hook
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!signInLoaded) return;
      
      const result = await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/',
        redirectUrlComplete: '/',
      });
      
      // The redirect will handle the authentication flow
    } catch (error) {
      console.error("Google login error:", error);
      setError('Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="flex-[0.3] p-10 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                disabled={loading}
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                disabled={loading}
              />
              <span
                className="absolute right-3 top-3 text-sm text-gray-400 cursor-pointer hover:text-yellow-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </span>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg transition duration-300 hover:from-blue-800 hover:to-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full p-3 bg-white text-gray-800 rounded-lg transition duration-300 hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              <img src="/images/google-icon.webp" alt="Google" className="w-5 h-5" />
              {loading ? "Processing..." : "Sign in with Google"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/register" className="text-yellow-400 hover:text-yellow-300">
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-[0.7] hidden md:block">
        <img
          src="images/login.jpg"
          alt="Login background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Login;