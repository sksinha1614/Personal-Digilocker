import api from "./api";

export const sendOTP = async (phone) => {
  const { data } = await api.post("/api/auth/send-otp", { phone });
  return data;
};

export const verifyOTP = async (phone, otp, name) => {
  const { data } = await api.post("/api/auth/verify-otp", { phone, otp, name });
  return data;
};
