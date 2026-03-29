import { useState, useEffect } from "react";
import { verifyOTP } from "../api/auth";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyOTP({ email, otp });
      window.location.href = "/";
    } catch (err) {
      alert(err?.response?.data?.message || "Verification failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-white/70 backdrop-blur-2xl border border-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-center">
          
          <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <span className="text-3xl">🛡️</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Verify Email
          </h2>
          <p className="text-gray-500 font-medium mb-8">
            We've sent a code to <br/>
            <span className="text-indigo-600 font-bold">{email}</span>
          </p>

          <div className="space-y-6">
            <div>
              <input
                type="text"
                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-center text-2xl tracking-[0.5em] text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || otp.length < 4}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:shadow-[0_8px_25px_rgb(99,102,241,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Verify Code"
              )}
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Didn't receive the code? 
              <button className="text-indigo-600 hover:text-purple-600 ml-2 font-bold transition-colors">
                Resend
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}