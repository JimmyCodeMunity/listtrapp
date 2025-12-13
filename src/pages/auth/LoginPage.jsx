import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Assuming your AuthContext has a 'login' function like the working example
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    // Use the login function from your AuthContext (matches your working example)
    const success = await login(email, password);

    if (success) {
      toast.success("Welcome back!");
      // Redirect to the original intended page or home (just like your working version)
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else {
      toast.error("Login failed. Please check your credentials.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Image - Hidden on mobile, visible on md+ (exactly like your working page) */}
      <div className="hidden md:block w-1/2">
        <img
          src="../images/side2.jpg"
          alt="Marketplace illustration"
          className="h-screen w-full object-cover rounded-r-3xl"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Marketplace
          </Link>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-semibold text-gray-900">Sign In</h2>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Please sign in to continue shopping
              </p>
            </div>

            {/* Google Login Button (placeholder) */}
            <button
              type="button"
              onClick={() => toast.info("Google login coming soon!")}
              className="w-full flex items-center justify-center gap-3 h-12 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="Google"
                className="h-5 w-5"
              />
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <p className="text-sm text-gray-500">or sign in with email</p>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="flex items-center h-12 bg-white border border-gray-300 rounded-full pl-5 pr-4 shadow-sm">
                <svg className="w-5 h-5 text-gray-500 mr-3" viewBox="0 0 16 11" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                  />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 outline-none text-gray-800 placeholder-gray-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="flex items-center h-12 bg-white border border-gray-300 rounded-full pl-5 pr-4 shadow-sm">
                <svg className="w-5 h-5 text-gray-500 mr-3" viewBox="0 0 13 17" fill="currentColor">
                  <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" />
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 outline-none text-gray-800 placeholder-gray-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="h-4 w-4 text-orange-600 rounded" />
                <label htmlFor="remember" className="text-gray-600">Remember me</label>
              </div>
              <Link to="/auth/forgot-credentials" className="text-orange-600 hover:text-orange-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/auth/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;