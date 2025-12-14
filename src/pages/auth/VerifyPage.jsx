import React, { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Loader2, CheckCircle2, XCircle, Mail, ArrowLeft } from "lucide-react";

const VerifyPage = () => {
  const { token } = useParams();
  const { handleSubmit } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const { status, data } = await handleSubmit(`/auth/verify-email/${token}`, {});

    setLoading(false);
    if (status === 201) {
      toast.success("Email verified successfully!");
      setVerified(true);
    } else if (status === 400) {
      toast.error("Email already verified or invalid token");
      setError(true);
    } else {
      toast.error(data?.message || "Verification failed");
      setError(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-orange-500 mb-6 transition-colors font-medium hover:underline"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-orange-200 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg">
              {verified ? (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={32} />
                </div>
              ) : error ? (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                  <XCircle className="text-white" size={32} />
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Mail className="text-white" size={32} />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {verified
                ? "Email Verified!"
                : error
                ? "Verification Failed"
                : "Verify Your Email"}
            </h1>
            <p className="text-neutral-600 text-lg">
              {verified
                ? "Your email has been successfully verified"
                : error
                ? "The verification link is invalid or expired"
                : "Click the button below to verify your account"}
            </p>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {verified ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 text-center">
                    You can now sign in to your account and start exploring!
                  </p>
                </div>
                <Link
                  to="/auth/signin"
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle2 size={18} />
                  Go to Sign In
                </Link>
              </div>
            ) : error ? (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 text-center">
                    This verification link may have expired or already been used.
                  </p>
                </div>
                <Link
                  to="/auth/signin"
                  className="w-full h-12 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Verify Email
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-neutral-500">
                      Already verified?
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

export default VerifyPage;
