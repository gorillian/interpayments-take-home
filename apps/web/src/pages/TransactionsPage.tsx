import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input, Pagination, Spin } from "antd"
import { SearchOutlined } from "@ant-design/icons"

import { SummaryBar } from "../components/SummaryBar"
import { TransactionList } from "../components/TransactionList"
import { useTransactions } from "../hooks/useTransactions"
import { PAGE_SIZE } from "../services/transaction-service"

export const TransactionsPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
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

      <TransactionList
        transactions={transactions}
        onSelect={(transaction) => navigate(`/transactions/${transaction.id}`)}
      />

      <div className="transaction-pagination">
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={totalCount}
          showSizeChanger={false}
          onChange={setPage}
        />
      </div>
    </>
  )
}
