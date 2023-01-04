import { Request, Response } from 'express'
import { Transaction } from '../models/Transactions'

export const getTransactions = async (req: Request, res: Response) => {
  if (!req.params.publicKey) { res.status(400).json({ detail: 'No public key provided' }); return }
  const transactions = await Transaction.find({ to: req.params.publicKey }).sort({ createdAt: -1 })
  if (transactions.length === 0) { res.status(404).json({ detail: 'No transactions found' }); return }
  const offset = req.params.offset ? Number(req.query.offset) * 50 : 0
  res.status(200).json(transactions.slice(offset, offset + 50))
}