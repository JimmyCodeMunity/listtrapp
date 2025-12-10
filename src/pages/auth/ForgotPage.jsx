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
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-center">
              {emailSent
                ? "Check your email for the reset link"
                : "No worries, we'll send you reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  className="w-full h-11 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                      size={18}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
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
                  className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  className="w-full h-11 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  Sign In
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPage;
