import useSWR from "swr"

import { fetchTransaction } from "../services/transaction-service"

export const useTransaction = (id: string | undefined) => {
  const { data, error, isLoading } = useSWR(id ? ["transaction", id] : null, () => fetchTransaction(id as string))

  return {
    transaction: data,
    error: error instanceof Error ? error.message : null,
    loading: isLoading,
  }
}
