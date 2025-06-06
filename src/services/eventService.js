import api from "../utils/api";

export const fetchEvents = async () => {
  try {
    const { data } = await api.get("/event");
    return data.allEvents;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch events";
    console.error("fetchEvents error:", errorMessage, error);
    throw new Error(errorMessage);
  }
};

export const fetchEventById = async (id) => {
  try {
    const { data } = await api.get(`/event/protected/${id}`);
    return data?.getEvent || data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch event ${id}`;
    console.error(`fetchEventById error (id: ${id}):`, errorMessage, error);
    throw new Error(errorMessage);
  }
};

export const registerForEvent = async (eventId, userId) => {
  try {
    const { data } = await api.post("/booking/protected/book", {
      eventId,
      userId,
    });
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      `Failed to register for event ${eventId}`;
    console.error(
      `registerForEvent error (eventId: ${eventId}, userId: ${userId}):`,
      errorMessage,
      error
    );
    throw new Error(errorMessage);
  }
};

export const cancelRegistration = async (bookingId) => {
  try {
    const { data } = await api.delete(`/booking/protected/${bookingId}`);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      `Failed to cancel registration ${bookingId}`;
    console.error(
      `cancelRegistration error (bookingId: ${bookingId}):`,
      errorMessage,
      error
    );
    throw new Error(errorMessage);
  }
};
