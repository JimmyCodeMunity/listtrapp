import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
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
import { Loader2, Mail, ArrowLeft, Send } from "lucide-react";

const ForgotPage = () => {
  const { handleSubmit } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    const body = { email };
    const { status, data } = await handleSubmit(
      `/send-forgot-password-link`,
      body
    );

    setLoading(false);
    if (status === 200) {
      toast.success("Reset link sent! Check your email.");
      setEmailSent(true);
    } else {
      toast.error(data?.message || "Failed to send reset link");
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
              <Mail className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-neutral-600 text-lg">
              {emailSent
                ? "Check your email for the reset link"
                : "No worries, we'll send you reset instructions"}
            </p>
          </div>
          {/* Content */}
          <div className="relative z-10">
            {emailSent ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <Send className="text-green-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">
                      Email Sent!
                    </h4>
                    <p className="text-sm text-green-700">
                      We have sent a password reset link to{" "}
                      <span className="font-medium">{email}</span>. Please
                      check your inbox and follow the instructions.
                    </p>
                  </div>
                </div>

                <div className="text-center text-sm text-neutral-600">
                  Did not receive the email?{" "}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Try again
                  </button>
                </div>

                <Link
                  to="/auth/signin"
                  className="w-full h-12 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-neutral-700">Email Address</label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors"
                      size={18}
                    />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder:text-neutral-400"
                      required
                    />
                  </div>
                  <p className="text-xs text-neutral-500">
                    Enter the email associated with your account
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Reset Link
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPage;
