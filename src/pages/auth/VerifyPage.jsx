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

    const { status, data } = await handleSubmit(`/verify-email/${token}`, {});

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
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              {verified ? (
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={32} />
                </div>
              ) : error ? (
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="text-red-600" size={32} />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <Mail className="text-orange-600" size={32} />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold text-center">
              {verified
                ? "Email Verified!"
                : error
                ? "Verification Failed"
                : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-center">
              {verified
                ? "Your email has been successfully verified"
                : error
                ? "The verification link is invalid or expired"
                : "Click the button below to verify your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {verified ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 text-center">
                    You can now sign in to your account and start exploring!
                  </p>
                </div>
                <Link
                  to="/auth/signin"
                  className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
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
                  className="w-full h-11 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default VerifyPage;
