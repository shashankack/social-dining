import api from "../utils/api";

// Store token and user data in localStorage
const storeAuthData = (token, user) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("currentUser", JSON.stringify(user));
};

// Clear auth data from localStorage
const clearAuthData = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
};

export const signIn = async (email, password) => {
  try {
    const res = await api.post("/user/signin", { email, password });
    storeAuthData(res.data.token, res.data.safeUserLogin);
    return res.data.safeUserLogin;
  } catch (err) {
    console.error("Sign-in failed:", err);
    throw new Error(
      err.response?.data?.message || "Sign-in failed. Please try again."
    );
  }
};

export const signUp = async (userData) => {
  try {
    const res = await api.post("/user/signup", userData);
    const { token, user } = res.data;
    storeAuthData(token, user);
    return { token, user };
  } catch (err) {
    console.error("Sign-up failed:", err);
    throw new Error(
      err.response?.data?.message || "Sign-up failed. Please try again."
    );
  }
};

export const getCurrentUser = async () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) return user;

  try {
    const res = await api.get("/user/me");
    localStorage.setItem("currentUser", JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) {
    console.error("Fetching user failed:", err);
    clearAuthData();
    throw new Error("Failed to fetch user details.");
  }
};

export const signOut = () => {
  clearAuthData();
  window.location.href = "/signin";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};
