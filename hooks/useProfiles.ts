import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { changePassword, deleteAvatarProfile, getMyProfile, updateAvatarProfile, updateDataProfile } from "@/service/profileService"

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await getMyProfile()
      return profile
    },
    staleTime: 60 * 1000,
    retry: 3,
  })
}

export const useUpdateProfile = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateDataProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useUpdateAvatar = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateAvatarProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useDeleteAvatar = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteAvatarProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword
  })
}