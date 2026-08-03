import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
} from "../services/message.service";

export const useConversations = () =>
  useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    refetchInterval: 5000, // poll every 5 s so the list stays fresh
  });

export const useMessages = (
  conversationId: string
) =>
  useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,

    refetchInterval: 2000,
  });

export const useSendMessage = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: sendMessage,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "messages",
          variables.conversationId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
  });
};