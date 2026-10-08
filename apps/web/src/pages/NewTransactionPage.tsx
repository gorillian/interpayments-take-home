import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, InputNumber, Select, message } from "antd"
import { mutate } from "swr"

import { CardBrand } from "../models/transaction"
import { createTransaction } from "../services/transaction-service"

const formatAmount = (value: string | number | undefined): string => {
  if (value === undefined || value === null || value === "") return ""
  const [intPart, decPart] = String(value).split(".")
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return decPart !== undefined ? `$${withCommas}.${decPart}` : `$${withCommas}`
}

const parseAmount = (value: string | undefined): number => {
  const cleaned = value?.replace(/\$\s?|,/g, "") ?? ""
  return cleaned === "" ? Number.NaN : Number(cleaned)
}

export const NewTransactionPage = () => {
  const navigate = useNavigate()
  const [merchantName, setMerchantName] = useState("")
  const [cardBrand, setCardBrand] = useState<CardBrand>(CardBrand.VISA)
  const [amount, setAmount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit =
    merchantName.trim() !== "" && Boolean(cardBrand) && amount !== null && Number.isFinite(amount)

  const handleSubmit = async () => {
    if (!canSubmit || amount === null) return
    setError(null)
    setSubmitting(true)
    try {
      await createTransaction({
        merchantName: merchantName.trim(),
        cardBrand,
        amount,
      })
      await mutate((key) => Array.isArray(key) && key[0] === "transactions")
      message.success("Transaction created")
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create transaction")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="new-transaction">
      <h2>New Transaction</h2>

      <div className="form-field">
        <Input
          placeholder="Merchant name"
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
        />
      </div>

      <div className="form-field">
        <Select
          style={{ width: "100%" }}
          value={cardBrand}
          onChange={(value) => setCardBrand(value)}
          options={[
            { value: CardBrand.VISA, label: "VISA" },
            { value: CardBrand.MASTERCARD, label: "MASTERCARD" },
            { value: CardBrand.AMEX, label: "AMEX" },
            { value: CardBrand.DISCOVER, label: "DISCOVER" },
          ]}
        />
      </div>

      <div className="form-field">
        <InputNumber
          style={{ width: "100%" }}
          placeholder="Amount"
          min={0}
          step={0.01}
          precision={2}
          controls={false}
          value={amount}
          formatter={formatAmount}
          parser={parseAmount}
          onChange={(value) => setAmount(typeof value === "number" && Number.isFinite(value) ? value : null)}
        />
      </div>

      <Button type="primary" disabled={!canSubmit || submitting} onClick={handleSubmit}>
        Create
      </Button>

      {error && <p className="form-error">{error}</p>}
      <p className="form-required">All fields are required.</p>
    </div>
  )
}
