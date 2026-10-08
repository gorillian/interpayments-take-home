import _ from "lodash"

import { TransactionStatus } from "../models/transaction.js"
import type { CardBrand, Transaction } from "../models/transaction.js"
import { loadTransactions } from "../data/transactions.js"

export interface TransactionSummary {
  count: number
  totalVolume: number
  totalSurcharge: number
}

export interface NewTransactionInput {
  merchantName: string
  cardBrand: CardBrand
  amount: number
  surcharge?: number
}

export const PAGE_SIZE = 50

export interface TransactionPageQuery {
  page?: number
  search?: string
}

export interface TransactionPage {
  transactions: Transaction[]
  totalCount: number
  totalProcessed: number
}

export const createTransactionService = () => {
  const transactions = loadTransactions()

  const getAll = (): Transaction[] => transactions

  const getById = (id: string): Transaction | undefined => transactions.find((t) => t.id === id)

  const getPage = ({ page, search }: TransactionPageQuery): TransactionPage => {
    const pageNum = Number.isInteger(page) && page !== undefined && page >= 1 ? page : 1
    const term = search?.trim().toLowerCase() ?? ""
    const filtered = term
      ? transactions.filter((t) => {
          return (
            t.merchantName.toLowerCase().includes(term) ||
            t.id.toLowerCase().includes(term) ||
            t.cardBrand.toLowerCase().includes(term) ||
            t.status.toLowerCase().includes(term)
          )
        })
      : transactions

    const start = (pageNum - 1) * PAGE_SIZE
    return {
      transactions: filtered.slice(start, pageNum * PAGE_SIZE),
      totalCount: filtered.length,
      totalProcessed: _.round(_.sumBy(filtered, "total"), 2),
    }
  }

  const getSummary = (): TransactionSummary => ({
    count: transactions.length,
    totalVolume: _.round(_.sumBy(transactions, "amount"), 2),
    totalSurcharge: _.round(_.sumBy(transactions, "surcharge"), 2),
  })

  const create = (input: NewTransactionInput): Transaction => {
    const surcharge = input.surcharge ?? 0
    const surchargeRate =
      input.amount > 0 && surcharge > 0 ? _.round(surcharge / input.amount, 4) : 0
    const transaction: Transaction = {
      id: `txn_${String(transactions.length + 1).padStart(6, "0")}`,
      merchantName: input.merchantName,
      cardBrand: input.cardBrand,
      amount: input.amount,
      surchargeRate,
      surcharge,
      total: _.round(input.amount + surcharge, 2),
      status: TransactionStatus.APPROVED,
      createdAt: new Date().toISOString(),
    }
    transactions.unshift(transaction)
    return transaction
  }

  return { getAll, getById, getPage, getSummary, create }
}

export type TransactionService = ReturnType<typeof createTransactionService>
