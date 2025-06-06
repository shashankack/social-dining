import api from "../utils/api";

export const getClubs = async () => {
  try {
    const { data } = await api.get("/club");
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch clubs";
    console.error("getClubs error:", errorMessage, error);
    throw new Error(errorMessage);
  }
};

export const registerForClub = async (clubId) => {
  try {
    const { data } = await api.put(`/club/protected/${clubId}`);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to register for club";
    console.error(
      `registerForClub error (clubId: ${clubId}):`,
      errorMessage,
      error
    );
    throw new Error(errorMessage);
  }
};
