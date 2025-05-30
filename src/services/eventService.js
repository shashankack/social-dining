import api from "../utils/api";

export const fetchEvents = async () => {
  const res = await api.get("/event", { withCredentials: true });
  return res.data;
};

export const fetchEventById = async (id) => {
  const res = await api.get(`/event/protected/${id}`, {
    withCredentials: true,
  });
  return res.getEvent;
};
