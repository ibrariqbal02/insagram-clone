import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation } from "../services/conversation.service";

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};