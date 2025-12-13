import axios from "axios";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PasswordSet = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/auth/update-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Password updated successfully!");
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch (err) {
      console.error("Password update error:", err);
      toast.error(
        err.response?.data?.message || "Failed to update password"
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full p-6">
        <h2 className="text-2xl tracking-wider text-neutral-700 font-semibold">
          Change Password
        </h2>
        <p className="text-sm text-neutral-500 mt-2">
          Update your password to keep your account secure
        </p>
      </div>
      <div className="w-full rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-white/20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -translate-y-12 translate-x-12 opacity-30"></div>
        
        <form onSubmit={handleSubmit} className="p-8 flex flex-col space-y-6 relative z-10">
          {/* Current Password */}
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-semibold text-neutral-700">
              Current Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors"
                size={18}
              />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-12 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder:text-neutral-400"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-semibold text-neutral-700">
              New Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors"
                size={18}
              />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-12 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder:text-neutral-400"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-semibold text-neutral-700">
              Confirm New Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors"
                size={18}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-12 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder:text-neutral-400"
                placeholder="Confirm new password"
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

          {/* Submit Button */}
          <div className="pt-4">
            {loading ? (
              <button
                disabled
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 rounded-xl flex flex-row items-center justify-center font-semibold shadow-lg opacity-50 cursor-not-allowed"
                type="button"
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Updating Password...
              </button>
            ) : (
              <button
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                type="submit"
              >
                Update Password
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordSet;
