import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { applyActionCode, getAuth, sendEmailVerification } from "firebase/auth";
import { Mail, CheckCircle } from "lucide-react";

export default function VerificationEmailPage() {
  const [searchParams] = useSearchParams();
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(""); // Optionally, set from user context
  const navigate = useNavigate();

  // Extract oobCode and verified param from URL
  const oobCode = searchParams.get("oobCode");
  const verifiedParam = searchParams.get("verified");

  useEffect(() => {
    if (oobCode) {
      const auth = getAuth();
      applyActionCode(auth, oobCode)
        .then(() => {
          setVerified(true);
          setMessage("Email verified! You can now log in.");
        })
        .catch((error) => {
          setVerified(false);
          setMessage("Verification failed: " + error.message);
        });
    } else if (verifiedParam === "1" || verifiedParam === "true") {
      setVerified(true);
      setMessage("Email verified! You can now log in.");
    } else {
      setVerified(false);
      setMessage("Invalid or missing verification code.");
    }
  }, [oobCode, verifiedParam]);

  const handleResend = async () => {
  try {
    // Get the user's email from state, props, or context
    const email = "akh8130@gmail.com" || ""; // Replace userEmail with your actual email source
    if (!email) {
      setMessage("Email not available. Please log in to resend verification email.");
      return;
    }

    const res = await fetch(
      `http://localhost:8080/api/user/resend-verification?email=${encodeURIComponent(email)}`,
      { method: "POST" }
    );

    if (res.ok) {
      setMessage("Verification email resent successfully!");
    } else {
      const errorText = await res.text();
      setMessage("Failed to resend verification email: " + errorText);
    }
  } catch (error) {
    setMessage("Failed to resend verification email: " + error.message);
  }
};


 

  const handleGoToLogin = () => {
    navigate("/login", { state: { emailVerified: true } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        {/* Icon */}
        <div className="bg-[#236571] rounded-full p-4 mb-4">
          <Mail className="w-10 h-10 text-white" />
        </div>
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#236571] mb-2 text-center">
          Verify Your Email Address
        </h1>
        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-6">
          We’ve sent a verification link to your email address. Please check your inbox and click the link to activate your account.
        </p>
        {/* Email Info */}
        <div className="w-full bg-gray-100 rounded-md px-4 py-3 flex items-center gap-2 mb-6">
          <CheckCircle className="w-5 h-5 text-[#EFC11A]" />
          <span className="text-gray-800 text-sm font-medium">
            Sent to: <span className="text-[#236571]">{email || "your.email@example.com"}</span>
          </span>
        </div>
        {/* Status Message */}
        {message && (
          <div
            className={`w-full mb-4 text-center rounded-md py-2 ${
              verified
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
        {/* Actions */}
        {verified ? (
          <button
            className="w-full bg-[#236571] hover:bg-[#17484b] text-white font-semibold rounded-md py-2 mb-3 transition"
            onClick={handleGoToLogin}
          >
            Go to Login
          </button>
        ) : (
          <>
            <button
              className="w-full bg-[#236571] hover:bg-[#17484b] text-white font-semibold rounded-md py-2 mb-3 transition"
              onClick={handleResend}
            >
              Resend Verification Email
            </button>
            
          </>
        )}
        {/* Help */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          Didn’t receive the email? Check your spam folder or&nbsp;
          <span className="text-[#236571] font-medium cursor-pointer hover:underline">
            contact support
          </span>
          .
        </div>
      </div>
    </div>
  );
}
