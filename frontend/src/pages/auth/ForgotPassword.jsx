import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../services/authService";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import {
  FiMail, FiLock, FiArrowLeft,
  FiActivity, FiShield, FiBell, FiClock, FiStar, FiCheck
} from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";

function ForgotPassword() {
  const navigate = useNavigate();

  // "email"  → step 1: enter email
  // "otp"    → step 2: enter OTP + new password
  // "done"   → step 3: success screen
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // OTP box refs for auto-focus
  const otpRefs = useRef([]);

  // GSAP refs
  const leftPanelRef  = useRef(null);
  const rightPanelRef = useRef(null);
  const badgeRef      = useRef(null);
  const headingRef    = useRef(null);
  const subtitleRef   = useRef(null);
  const statsRef      = useRef(null);
  const featuresRef   = useRef(null);
  const trustRef      = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(leftPanelRef.current,  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(rightPanelRef.current, { x: "100%", opacity: 0 }, { x: "0%", opacity: 1, duration: 0.9 }, "-=0.4")
      .fromTo(badgeRef.current,      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
      .fromTo(headingRef.current,    { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.55 }, "-=0.3")
      .fromTo(subtitleRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .fromTo(statsRef.current,      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.25")
      .fromTo(featuresRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.25")
      .fromTo(trustRef.current,      { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
    return () => tl.kill();
  }, []);

  // 60s resend countdown — matches backend cooldown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // ── Step 1: Send reset OTP ────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword(email);
      toast.success("Reset OTP sent to your email!");
      setStep("otp");
      setResendTimer(60);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP + reset password ───────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length < 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const data = await resetPassword(email, otpString, newPassword);
      toast.success(data.message || "Password reset successful!");
      setStep("done");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Resend reset OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true);
      await forgotPassword(email);
      toast.success("New OTP sent!");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // OTP box handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otp];
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setOtp(updated);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">

      {/* ── Left: Form Panel ── */}
      <div
        ref={leftPanelRef}
        className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-14 py-6 bg-slate-50 overflow-y-auto"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <FaHeartbeat className="text-white text-base" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight"><MedSync></MedSync></span>
        </div>

        {/* ════════════════════════════════════════
            STEP 1 — Enter Email
            ════════════════════════════════════════ */}
        {step === "email" && (
          <>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm mb-6 w-fit transition"
            >
              <FiArrowLeft />
              Back to sign in
            </button>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <FiLock className="text-blue-500 text-2xl" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-1">Forgot password?</h1>
            <p className="text-slate-500 text-sm mb-7">
              No worries — enter your email and we'll send you a reset code.
            </p>

            <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <FiMail className="text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                {loading ? "Sending OTP…" : "Send Reset Code"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Remember your password?{" "}
              <Link to="/" className="text-blue-500 font-semibold hover:underline">Sign in</Link>
            </p>
            <p className="text-center text-xs text-slate-400 mt-3">
              © 2026 MedSync. Your data, encrypted &amp; private.
            </p>
          </>
        )}

        {/* ════════════════════════════════════════
            STEP 2 — OTP + New Password
            ════════════════════════════════════════ */}
        {step === "otp" && (
          <>
            <button
              onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm mb-6 w-fit transition"
            >
              <FiArrowLeft />
              Back
            </button>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <FiMail className="text-blue-500 text-2xl" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-1">Check your email</h1>
            <p className="text-slate-500 text-sm mb-1">We sent a 6-digit reset code to</p>
            <p className="text-blue-500 font-semibold text-sm mb-6">{email}</p>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">

              {/* OTP Boxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Reset code</label>
                <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-bold border border-slate-200 rounded-xl bg-white text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  ))}
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <FiLock className="text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                <div className={`flex items-center bg-white border rounded-xl focus-within:ring-2 transition ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
                    : "border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-100"
                }`}>
                  <FiLock className="text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
                {/* Inline mismatch warning */}
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>

            {/* Resend */}
            <div className="text-center mt-5">
              {resendTimer > 0 ? (
                <p className="text-sm text-slate-400">
                  Resend code in{" "}
                  <span className="font-semibold text-slate-600">{resendTimer}s</span>
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Didn't receive the code?{" "}
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-blue-500 font-semibold hover:underline disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </p>
              )}
            </div>

            <p className="text-center text-xs text-slate-400 mt-5">
              © 2026 MedSync. Your data, encrypted &amp; private.
            </p>
          </>
        )}

        {/* ════════════════════════════════════════
            STEP 3 — Success Screen
            ════════════════════════════════════════ */}
        {step === "done" && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <FiCheck className="text-green-500 text-3xl" strokeWidth={2.5} />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Password reset!</h1>
            <p className="text-slate-500 text-sm mb-8">
              Your password has been updated successfully.
              You can now sign in with your new password.
            </p>

            <Link
              to="/"
              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-colors text-center block"
            >
              Back to Sign in
            </Link>
          </div>
        )}
      </div>

      {/* ── Right: Marketing Panel ── */}
      <div
        ref={rightPanelRef}
        className="hidden lg:flex flex-col justify-center w-1/2 px-14 py-8 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-white/5" />

        <div ref={badgeRef} className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 w-fit mb-6 text-sm font-medium backdrop-blur-sm">
          <FiStar className="text-white text-xs" />
          AI-powered health companion
        </div>

        <h2 ref={headingRef} className="text-4xl font-extrabold leading-tight tracking-tight mb-3">
          Take command of your health, one capsule at a time.
        </h2>
        <p ref={subtitleRef} className="text-white/80 text-base leading-relaxed mb-6">
          Track medications, log symptoms, and get personalized insights — all in one calm, focused dashboard.
        </p>

        <div ref={statsRef} className="flex gap-4 mb-6">
          {[
            { icon: <FiActivity className="text-white text-lg" />,  value: "98%",   label: "Adherence tracking · average user score" },
            { icon: <FaHeartbeat className="text-white text-lg" />, value: "2.4M+", label: "Symptoms logged · and counting" },
          ].map((stat, i) => (
            <div key={i} className="flex-1 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
              {stat.icon}
              <div className="text-3xl font-extrabold mt-2 mb-1 tracking-tight">{stat.value}</div>
              <div className="text-xs text-white/70 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>

        <div ref={featuresRef} className="flex flex-col gap-3 mb-6">
          {[
            { icon: <FiShield />, text: "End-to-end encrypted health records" },
            { icon: <FiLock />,   text: "HIPAA-aligned data handling" },
            { icon: <FiBell />,   text: "Smart reminders that adapt to your routine" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white text-xs">
                {item.icon}
              </div>
              <span className="text-sm text-white/90">{item.text}</span>
            </div>
          ))}
        </div>

        <div ref={trustRef} className="flex items-center gap-2">
          <FiClock className="text-white/60 text-sm shrink-0" />
          <span className="text-xs text-white/65">Trusted by clinicians and 50k+ patients worldwide.</span>
        </div>
      </div>

    </div>
  );
}

export default ForgotPassword;