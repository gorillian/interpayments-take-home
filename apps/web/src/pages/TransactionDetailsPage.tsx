import { Descriptions, Spin, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";

import { useTransaction } from "../hooks/useTransaction";
import { formatCurrency, formatDate } from "../utils/format";
import { statusTagColor } from "../utils/status";

export const TransactionDetailsPage = () => {
  const { id } = useParams();
  const { transaction, error, loading } = useTransaction(id);

  if (loading) {
    return (
      <div className="app-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="transaction-detail">
      <Link to="/" className="back-link">
        <ArrowLeftOutlined />
        Back to table
      </Link>

      {error && <p className="form-error">{error}</p>}

      {transaction && (
        <>
          <h2 className="mono">{transaction.id}</h2>
          <Descriptions
            column={1}
            size="small"
            bordered
            items={[
              {
                key: "merchant",
                label: "Merchant",
                children: transaction.merchantName,
              },
              {
                key: "card",
                label: "Card brand",
                children: transaction.cardBrand,
              },
              {
                key: "amount",
                label: "Amount",
                children: formatCurrency(transaction.amount),
              },
              {
                key: "surcharge",
                label: "Surcharge",
                children: `${formatCurrency(transaction.surcharge)} (${(transaction.surchargeRate * 100).toFixed(1)}%)`,
              },
              {
                key: "total",
                label: "Total",
                children: formatCurrency(transaction.total),
              },
              {
                key: "status",
                label: "Status",
                children: (
                  <Tag color={statusTagColor(transaction.status)}>
                    {transaction.status}
                  </Tag>
                ),
              },
              {
                key: "date",
                label: "Date",
                children: formatDate(transaction.createdAt),
              },
            ]}
          />
        </>
      )}
    </div>
  );
};
