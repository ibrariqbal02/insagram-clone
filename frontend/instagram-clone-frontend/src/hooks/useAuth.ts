import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as authService from "../services/auth.service";

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["me"],
      });
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authService.getMyProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      const userId = variables.get("userId") as string | null;

      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["profile", userId],
        });

        queryClient.invalidateQueries({
          queryKey: ["user-posts", userId],
        });
      }
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authService.changePassword,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};
