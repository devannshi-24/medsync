import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import {
  FiUser, FiMail, FiLock, FiUsers, FiChevronDown,
  FiCheck, FiActivity, FiShield, FiBell, FiClock, FiStar
} from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await registerUser(formData);
      toast.success(data.message || "Registration successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      console.log(error.response);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">

      {/* ── Left: Form Panel ── */}
      <div
        ref={leftPanelRef}
        className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-14 py-6 bg-slate-50 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <FaHeartbeat className="text-white text-base" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">Med-Core</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-1">Create your account</h1>
        <p className="text-slate-500 text-sm mb-6">Your personal health command center — built around you.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Full Name */}
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

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <FiLock className="text-slate-400 ml-3.5 shrink-0" />
              <input
                type="password"
                name="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Use 8+ characters with a mix of letters and numbers.</p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <FiUsers className="text-slate-400 ml-3.5 shrink-0" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none appearance-none cursor-pointer pr-8"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
              <FiChevronDown className="text-slate-400 absolute right-3 pointer-events-none" />
            </div>
          </div>

          {/* Terms checkbox */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 font-semibold hover:underline">
            Sign in
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
            { icon: <FiActivity className="text-white text-lg" />, value: "98%",   label: "Adherence tracking · average user score" },
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