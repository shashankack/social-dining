import api from "../utils/api";

export const getClubs = async () => {
  const res = await api.get("/club");
  return res.data;
};

export const registerForClub = async (clubId) => {
  const res = await api.put(
    `/club/protected/${clubId}`,
    {},
    { withCredentials: true }
  );
  return res.data;
};
