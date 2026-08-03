
import api from "../api/axios";

export const createConversation = async (receiverId: string) => {
  const { data } = await api.post("/conversation", {
    receiverId,
  });

  return data;
};