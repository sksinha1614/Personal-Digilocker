import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Phone, KeyRound, User, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendOTP, verifyOTP } from "../services/authService";
import { useStore } from "../store/useStore";
import logoImg from "../assets/digilocker-logo.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [step, setStep] = useState("phone"); // phone | otp | name
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverOtp, setServerOtp] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await sendOTP(phone);
      setIsNew(res.is_new);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    if (isNew && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await verifyOTP(phone, otp, isNew ? name : undefined);
      login(res.token, res.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen items-center justify-center p-4 flex bg-gradient-to-br from-[#e0f2fe] via-[#ecfdf5] to-[#ccfbf1]">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#3e9ae8]/20 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#1ebf81]/20 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo block */}
        <div className="flex flex-col items-center justify-center gap-1 mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl relative mb-2"
          >
            <img src={logoImg} alt="Digilocker" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Card */}
        <div className="vault-card p-8">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl text-vault-800 mb-1">
              {step === "phone" ? "Welcome" : "Verify OTP"}
            </h2>
            <p className="text-cream-500 text-sm">
              {step === "phone"
                ? "Enter your phone number to get started"
                : `OTP sent to +91 ${phone}. Check your server console.`}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOTP}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs text-cream-500 uppercase tracking-wider mb-1 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="vault-input pl-10"
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="w-full relative flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl text-white font-bold tracking-wide shadow-[0_6px_0_0_#148f61,0_6px_10px_0_rgba(0,0,0,0.15)] hover:shadow-[0_4px_0_0_#148f61,0_4px_6px_0_rgba(0,0,0,0.15)] hover:translate-y-[2px] active:shadow-[0_0px_0_0_#148f61,0_0px_0px_0_rgba(0,0,0,0)] active:translate-y-[6px] transition-all duration-150 bg-gradient-to-r from-[#3e9ae8] to-[#1ebf81] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send OTP <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyOTP}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs text-cream-500 uppercase tracking-wider mb-1 block">
                    OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="vault-input pl-10 tracking-widest text-center font-mono text-lg"
                      autoFocus
                    />
                  </div>
                </div>

                {isNew && (
                  <div>
                    <label className="text-xs text-cream-500 uppercase tracking-wider mb-1 block">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="vault-input pl-10"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6 || (isNew && !name.trim())}
                  className="w-full relative flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl text-white font-bold tracking-wide shadow-[0_6px_0_0_#148f61,0_6px_10px_0_rgba(0,0,0,0.15)] hover:shadow-[0_4px_0_0_#148f61,0_4px_6px_0_rgba(0,0,0,0.15)] hover:translate-y-[2px] active:shadow-[0_0px_0_0_#148f61,0_0px_0px_0_rgba(0,0,0,0)] active:translate-y-[6px] transition-all duration-150 bg-gradient-to-r from-[#3e9ae8] to-[#1ebf81] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mb-3"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify & Login <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError("");
                  }}
                  className="vault-btn-outline w-full justify-center text-sm"
                >
                  Change Phone Number
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-[11px] text-cream-500 mt-6">
            OTP is printed in the backend server console (mock SMS).
          </p>
        </div>
      </motion.div>
    </div>
  );
}
