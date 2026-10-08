import { Statistic } from "antd"

interface SummaryBarProps {
  count: number
  totalProcessed: number
}

export const SummaryBar = ({ count, totalProcessed }: SummaryBarProps) => {
  return (
    <div className="summary-bar">
      <Statistic title="Transactions" value={count} />
      <Statistic title="Total processed" value={totalProcessed} precision={2} prefix="$" />
    </div>
  )
}
