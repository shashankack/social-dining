import { jwtDecode } from "jwt-decode";

export const getDecodedUser = (token) => {
  const cookies = document.cookie;
  const tokenMatch = cookies.match(/token=([^;]+)/);
  if (!tokenMatch) return null;

  try {
    const decoded = jwtDecode(tokenMatch[1]);
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
};
