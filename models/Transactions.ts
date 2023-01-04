import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    unique: false
  },
  signature: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true,
    unique: false
  },
  to: {
    type: String,
    required: true,
    unique: false
  },
  amount: {
    type: Number,
    required: true,
    unique: false
  },
  amountInUSD: {
    type: Number,
    required: false,
    unique: false
  },
  createdAt: {
    type: Date,
    required: false,
    unique: false,
    default: Date.now
  },
  token: {
    type: String,
    required: true,
    unique: false
  },
  message: {
    type: String,
    required: false,
    unique: false
  },
  status: {
    type: String,
    required: true,
    unique: false
  }
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

export { Transaction }