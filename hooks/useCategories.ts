import { getCategories } from "@/service/categoriesService"
import { useQuery } from "@tanstack/react-query"

export const useCategories = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const category = await getCategories()
      return category
    },
    staleTime: 60 * 1000,
    retry: 3,
  })
}