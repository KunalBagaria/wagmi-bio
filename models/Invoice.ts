import mongoose from 'mongoose'

const InvoiceSchema = new mongoose.Schema({
  publicKey: {
    type: String,
    required: true,
    unique: false
  },
  link: {
    type: String,
    required: true,
    unique: false
  },
  invoiceNumber: {
    type: Number,
    required: true,
    unique: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: false,
    unique: false,
  },
  status: {
    type: String,
    required: true,
    unique: false
  },
  createdAt: {
    type: Date,
    required: false,
    unique: false,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: false,
    unique: false
  },
  amount: {
    type: Number,
    required: true,
    unique: false
  },
  client: {
    name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: false },
    address: { type: String, required: false, unique: false}
  },
  particulars: [{
    name: { type: String, required: true, unique: false },
    quantity: { type: Number, required: true, unique: false },
    price: { type: Number, required: true, unique: false }
  }]
})

const Invoice = mongoose.model('Invoice', InvoiceSchema)

export { Invoice }