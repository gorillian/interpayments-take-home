import type { CardBrand, Transaction } from "../models/transaction"

const API_BASE = "/api"

export const PAGE_SIZE = 50

export interface TransactionPage {
  transactions: Transaction[]
  totalCount: number
  totalProcessed: number
}

export const fetchTransaction = async (id: string): Promise<Transaction> => {
  const rsp = await fetch(`${API_BASE}/transactions/${encodeURIComponent(id)}`)
  const data = await rsp.json()
  if (!rsp.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Transaction not found")
  }
  return data
}

export const fetchTransactions = async ({
  page,
  search,
}: {
  page: number
  search: string
}): Promise<TransactionPage> => {
  const params = new URLSearchParams({ page: String(page) })
  if (search) params.set("search", search)
  const rsp = await fetch(`${API_BASE}/transactions?${params}`)
  return rsp.json()
}

export interface NewTransactionInput {
  merchantName: string
  cardBrand: CardBrand
  amount: number
  surcharge?: number
}

export const createTransaction = async (input: NewTransactionInput): Promise<Transaction> => {
  const rsp = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  })
  const data = await rsp.json()
  if (!rsp.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Could not create transaction")
  }
  return data
}
