import { createClientSupabase } from "@/lib/supabase/client"
import { confirmClosed, createReport, deleteReport, fetchClaimHistory, findReport, getMyReports, getReports, updateReport } from "@/service/reportsService"
import { fetchRewardHistory } from "@/service/rewardService"
import { createReportData } from "@/types"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export const useReports = (page = 1, limit = 6) => {
  const params = useSearchParams()
  const status = params.get("status")
  const category = params.get("category")
  const search = params.get("search")

  return useQuery({
    queryKey: ["reports", page, status, category, search],
    queryFn: () => getReports(page, limit, { status, category, search })
  })
}


export const useFindReport = (id_item: string) => {
  return useQuery({
    queryKey: ["item", id_item],
    queryFn: () => findReport(id_item),
    staleTime: 60 * 1000,
    retry: 3,
  })
}

export const useCreateReport = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] })
    },
  })
}

export const useUpdateReport = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id_item, payload }: { id_item: string; payload: createReportData }) =>
      updateReport(id_item, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["items"] })
      qc.invalidateQueries({ queryKey: ["item", variables.id_item] })
    },
  })
}

export const useDeleteReport = () => {
  const qc = useQueryClient() 
  return useMutation({
    mutationFn: (id_item: string) => deleteReport(id_item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] })
      qc.invalidateQueries({ queryKey: ["my-reports"] })
    },
  })
}

export const useMyReports = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const items = await getMyReports()
      return items
    },
    staleTime: 60 * 1000,
    retry: 3,
  })
}

export const useReportsSummary = () => {
  return useQuery({
    queryKey: ["items-summary"],
    queryFn: async () => {
      const [{ count: total }, { count: missing }, { count: found }] =
        await Promise.all([
          createClientSupabase().from("items").select("*", { count: "exact", head: true }),
          createClientSupabase()
            .from("items")
            .select("*", { count: "exact", head: true })
            .eq("status", "hilang"),
          createClientSupabase()
            .from("items")
            .select("*", { count: "exact", head: true })
            .eq("status", "ditemukan"),
        ])

      return {
        total: total ?? 0,
        missing: missing ?? 0,
        found: found ?? 0,
      }
    },
  })
}

export const useClaimHistory = (myProfileId?: string | null) => {
  return useQuery({
    queryKey: ["claim-history", myProfileId],
    queryFn: () => {
      if (!myProfileId) throw new Error("Profile ID tidak tersedia")
      return fetchClaimHistory(myProfileId)
    },
    enabled: !!myProfileId,
    staleTime: 60 * 1000,
  })
}

export const useRewardHistory = (myProfileId?: string | null) => {
  return useQuery({
    queryKey: ["reward-history", myProfileId],
    queryFn: () => {
      if (!myProfileId) throw new Error("Profile ID tidak tersedia")
      return fetchRewardHistory(myProfileId)
    },
    enabled: !!myProfileId,
    staleTime: 60 * 1000,
  })
}

export const useConfirmClosed = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId }: {itemId: string }) => {
      if (!itemId) throw new Error("Parameter tidak lengkap")
      return await confirmClosed(itemId)
    },
    onSuccess: () => {
      qc.invalidateQueries()
    },
  })
}