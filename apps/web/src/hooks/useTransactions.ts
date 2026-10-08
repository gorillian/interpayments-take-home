import useSWR from "swr"

import { fetchTransactions } from "../services/transaction-service"

export const useTransactions = (page: number, search: string) => {
  const { data, isLoading } = useSWR(
    ["transactions", page, search],
    () => fetchTransactions({ page, search }),
    { keepPreviousData: true },
  )

  return {
    transactions: data?.transactions ?? [],
    totalCount: data?.totalCount ?? 0,
    totalProcessed: data?.totalProcessed ?? 0,
    loading: isLoading,
  }
}
