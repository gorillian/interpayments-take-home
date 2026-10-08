import express from "express"
import type { NextFunction, Request, Response } from "express"
import cors from "cors"

import { PORT } from "./config.js"
import { CardBrand } from "./models/transaction.js"
import { createTransactionService } from "./services/transaction-service.js"

const isCardBrand = (value: unknown): value is CardBrand =>
  typeof value === "string" && (Object.values(CardBrand) as string[]).includes(value)

const roundUpToCent = (amount: number): number =>
  Number((Math.ceil(Number((amount * 100).toFixed(8))) / 100).toFixed(2))

const app = express()

app.use(cors({ origin: "*", credentials: true }))
app.use(express.json())

const transactionService = createTransactionService()

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" })
})

app.get("/api/transactions", (req: Request, res: Response) => {
  console.log("GET /api/transactions", req.query)
  const page = Number(req.query.page)
  const search = typeof req.query.search === "string" ? req.query.search : ""
  res.json(transactionService.getPage({ page, search }))
})

app.get("/api/transactions/summary", (_req: Request, res: Response) => {
  res.json(transactionService.getSummary())
})

app.post("/api/transactions", (req: Request, res: Response) => {
  const { merchantName, cardBrand, amount } = req.body

  if (typeof merchantName !== "string" || merchantName.trim() === "") {
    return res.status(400).json({ error: "name missing" })
  }
  if (!isCardBrand(cardBrand)) {
    return res.status(400).json({ error: "card missing" })
  }
  if (amount === undefined || amount === null || amount === "") {
    return res.status(400).json({ error: "amount missing" })
  }

  const parsed = typeof amount === "number" ? amount : Number(amount)
  if (!Number.isFinite(parsed)) {
    return res.status(400).json({ error: "amount invalid" })
  }

  const transaction = transactionService.create({
    merchantName: merchantName.trim(),
    cardBrand,
    amount: roundUpToCent(parsed),
  })
  res.status(201).json(transaction)
})

app.get("/api/transactions/:id", (req: Request, res: Response) => {
  const transaction = transactionService.getById(req.params.id)
  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" })
  }
  res.json(transaction)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: err.message, stack: err.stack })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT} (${transactionService.getAll().length} transactions)`)
})
