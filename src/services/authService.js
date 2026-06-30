import api from "./api";

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const googleAuthService = async (token) => {
  const response = await api.post("/auth/google", { token });
  return response.data;
};

// ── OTP Registration ──────────────────────────────────────

// Step 1 — Send OTP to email (validates + hashes password on backend)
export const sendOTP = async (name, email, password) => {
  const response = await api.post("/auth/send-otp", {
    name,
    email,
    password,
  });
  return response.data;
};

// Step 2 — Verify OTP → creates user → returns JWT
export const verifyOTP = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

// ── Forgot Password ───────────────────────────────────────

// Step 1 — Send reset OTP to email
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

// Step 2 — Verify OTP + set new password
export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return response.data;
};