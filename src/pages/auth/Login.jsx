import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, googleAuthService } from "../../services/authService";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { GoogleLogin } from "@react-oauth/google";
import {
  FiMail, FiLock, FiCheck, FiActivity, FiShield,
  FiBell, FiClock, FiStar
} from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginUser(formData);
      toast.success(data.message || "Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // credentialResponse.credential is the ID token —
  // same /auth/google endpoint, backend handles new vs returning user
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleAuthService(credentialResponse.credential);
      toast.success(data.message || "Google sign-in successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Google sign-in failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was cancelled or failed");
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">

      {/* ── Left: Form Panel ── */}
      <div
        ref={leftPanelRef}
        className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16 py-6 bg-slate-50 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <FaHeartbeat className="text-white text-base" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">Med-Core</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-1">Welcome back</h1>
        <p className="text-slate-500 text-sm mb-6">Sign in to continue managing your health.</p>

        {/* ── Google Button ── */}
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
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* ── Email Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <span className="text-sm text-blue-500 font-medium cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <FiLock className="text-slate-400 ml-3.5 shrink-0" />
              <input
                type="password"
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setRemember(!remember)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                remember ? "bg-blue-500 border-blue-500" : "border-slate-300 bg-transparent"
              }`}
            >
              {remember && <FiCheck className="text-white text-xs" strokeWidth={3} />}
            </button>
            <span className="text-sm text-slate-600">Remember me for 30 days</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          New to Med-Core?{" "}
          <Link to="/register" className="text-blue-500 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-slate-400 mt-3">
          © 2026 Med-Core. Your data, encrypted &amp; private.
        </p>
      </div>

      {/* ── Right: Marketing Panel ── */}
      <div
        ref={rightPanelRef}
        className="hidden lg:flex flex-col justify-center w-1/2 px-14 py-8 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-white/5" />

        <div ref={badgeRef} className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 w-fit mb-8 text-sm font-medium backdrop-blur-sm">
          <FiStar className="text-white text-xs" />
          Welcome back to your command center
        </div>

        <h2 ref={headingRef} className="text-4xl font-extrabold leading-tight tracking-tight mb-3">
          Your health, perfectly in sync.
        </h2>
        <p ref={subtitleRef} className="text-white/80 text-base leading-relaxed mb-8">
          Pick up right where you left off — reminders, insights, and your care team are waiting.
        </p>

        <div ref={statsRef} className="flex gap-4 mb-8">
          {[
            { icon: <FiActivity className="text-white text-lg" />,  value: "12d", label: "Active streak · of perfect adherence" },
            { icon: <FaHeartbeat className="text-white text-lg" />, value: "87",  label: "Wellness score · +4 this week" },
          ].map((stat, i) => (
            <div key={i} className="flex-1 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
              {stat.icon}
              <div className="text-3xl font-extrabold mt-2 mb-1 tracking-tight">{stat.value}</div>
              <div className="text-xs text-white/70 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>

        <div ref={featuresRef} className="flex flex-col gap-3 mb-8">
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

export default Login;