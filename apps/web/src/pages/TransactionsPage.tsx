import { useEffect, useRef, useState } from "react"
import { Input, Pagination, Spin } from "antd"
import { SearchOutlined } from "@ant-design/icons"

import { SummaryBar } from "../components/SummaryBar"
import { TransactionList } from "../components/TransactionList"
import { TransactionModal } from "../components/TransactionModal"
import { useTransactions } from "../hooks/useTransactions"
import type { Transaction } from "../models/transaction"
import { PAGE_SIZE } from "../services/transaction-service"

export const TransactionsPage = () => {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const debouncedRef = useRef(debouncedSearch)

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = search.trim()
      if (debouncedRef.current === next) return
      debouncedRef.current = next
      setDebouncedSearch(next)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { transactions, totalCount, totalProcessed, loading } = useTransactions(page, debouncedSearch)

  if (loading) {
    return (
      <div className="app-loading">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <>
      <header className="app-header">
        <h1>Transactions</h1>
        <Input
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
          allowClear
          placeholder="Search merchant, id, card, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <SummaryBar count={totalCount} totalProcessed={totalProcessed} />

      <TransactionList transactions={transactions} onSelect={setSelected} />

      <div className="transaction-pagination">
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={totalCount}
          showSizeChanger={false}
          onChange={setPage}
        />
      </div>

      <TransactionModal transaction={selected} onClose={() => setSelected(null)} />
    </>
  )
}
