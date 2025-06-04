import api from "../utils/api";

export const signIn = async (email, password) => {
  const res = await api.post("/user/signin", { email, password });
  return res.data;
};

export const signUp = async (userData) => {
  const res = await api.post("/user/signup", userData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/user/me");
  return res.data.user;
};

export const signOut = () => {
  window.location.href = "/";
};
