import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  sendOTP, verifyOTP, googleAuthService } from "../../services/authService";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { GoogleLogin } from "@react-oauth/google";
import {
  FiUser, FiMail, FiLock,FiArrowLeft,
  FiCheck, FiActivity, FiShield, FiBell, FiClock, FiStar
} from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef([]);

  const rightPanelRef = useRef(null);
  const badgeRef      = useRef(null);
  const headingRef    = useRef(null);
  const subtitleRef   = useRef(null);
  const statsRef      = useRef(null);
  const featuresRef   = useRef(null);
  const trustRef      = useRef(null);
  const leftPanelRef  = useRef(null);

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


  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Step 1: Send OTP ──────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendOTP(formData.name, formData.email, formData.password);
      toast.success("OTP sent to your email!");
      setStep("otp");
      setResendTimer(60); // backend enforces 60s cooldown
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }
    try {
      setLoading(true);
      const data = await verifyOTP(formData.email, otpString);
      toast.success(data.message || "Email verified! Welcome aboard 🎉");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true);
      await sendOTP(formData.name, formData.email, formData.password);
      toast.success("New OTP sent to your email!");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  //  Handle each OTP box — auto-advance, handle backspace
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const updated = [...otp];
    updated[index] = value.slice(-1);  // take only last character
    setOtp(updated);
    // Auto-focus next box
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };
 
  const handleOtpKeyDown = (index, e) => {
    // On backspace, clear current and go back
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
    // Focus last filled box
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     const data = await registerUser(formData);
  //     toast.success(data.message || "Registration successful");
  //     navigate("/");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response?.data?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleAuthService(credentialResponse.credential);
      toast.success(data.message || "Google sign-up successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Google sign-up failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-up was cancelled or failed");
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
          <span className="font-bold text-lg text-slate-800 tracking-tight">Med-Core</span>
        </div>

        {step === "form" && (
          <>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm mb-5">Your personal health command center — built around you.</p>
 
            {/* Google Button */}
            <div className="w-full mb-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                width={460}
                text="continue_with"
                shape="rectangular"
              />
            </div>
 
            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">or register with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
 
            {/* Form */}
            <form onSubmit={handleSendOTP} className="flex flex-col gap-3.5">
 
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <FiUser className="text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <FiMail className="text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <FiLock className="text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="password"
                    name="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Use 6+ characters with a mix of letters and numbers.</p>
              </div>
 
              {/* Terms */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    agreed ? "bg-blue-500 border-blue-500" : "border-slate-300 bg-transparent"
                  }`}
                >
                  {agreed && <FiCheck className="text-white text-xs" strokeWidth={3} />}
                </button>
                <span className="text-sm text-slate-600">
                  I agree to the{" "}
                  <span className="text-blue-500 font-medium cursor-pointer">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-blue-500 font-medium cursor-pointer">Privacy Policy</span>.
                </span>
              </div>
 
              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                {loading ? "Sending OTP…" : "Continue"}
              </button>
            </form>
 
            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 font-semibold hover:underline">Sign in</Link>
            </p>
            <p className="text-center text-xs text-slate-400 mt-3">
              © 2026 Med-Core. Your data, encrypted &amp; private.
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            {/* Back button */}
            <button
              onClick={() => { setStep("form"); setOtp(["", "", "", "", "", ""]); }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm mb-6 w-fit transition"
            >
              <FiArrowLeft />
              Back
            </button>
 
            {/* Email icon circle */}
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <FiMail className="text-blue-500 text-2xl" />
            </div>
 
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Check your email</h1>
            <p className="text-slate-500 text-sm mb-1">
              We sent a 6-digit code to
            </p>
            <p className="text-blue-500 font-semibold text-sm mb-7">{formData.email}</p>
 
            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
 
              {/* 6 OTP boxes */}
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
 
              <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                {loading ? "Verifying…" : "Verify & Create Account"}
              </button>
            </form>
 
            {/* Resend OTP */}
            <div className="text-center mt-5">
              {resendTimer > 0 ? (
                <p className="text-sm text-slate-400">
                  Resend OTP in{" "}
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
                    Resend OTP
                  </button>
                </p>
              )}
            </div>
 
            <p className="text-center text-xs text-slate-400 mt-6">
              © 2026 Med-Core. Your data, encrypted &amp; private.
            </p>
          </>
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

export default Register;