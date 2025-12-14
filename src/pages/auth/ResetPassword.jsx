import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Eye, EyeOff, Loader2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

const ResetPasswordPage = () => {
  const { handleSubmit } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handlePassReset = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const body = { password };
    const { status, data } = await handleSubmit(`/auth/reset-password/${token}`, body);

    setLoading(false);
    if (status === 200) {
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/auth/signin"), 2000);
    } else {
      toast.error(data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-md">
        <Link
          to="/auth/signin"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-orange-500 mb-6 transition-colors font-medium hover:underline"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-orange-200 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
          
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mb-6 shadow-lg">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Reset Password
            </h1>
            <p className="text-neutral-600 text-lg">
              Enter your new password below
            </p>
          </div>
          {/* Content */}
          <div className="relative z-10">
            <form onSubmit={handlePassReset} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-700">New Password</label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors"
                    size={18}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder:text-neutral-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-neutral-500">
                  Must be at least 6 characters
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-700">Confirm Password</label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors"
                    size={18}
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder:text-neutral-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Resetting password...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Reset Password
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-neutral-500">
                    Remember your password?
                  </span>
                </div>
              </div>

              <Link
                to="/auth/signin"
                className="w-full h-12 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center hover:shadow-md transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
