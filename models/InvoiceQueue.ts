import mongoose from 'mongoose';

const InvoiceQueueSchema = new mongoose.Schema({
  invoiceNumber: {
    type: Number,
    required: true,
    unique: true
  },
  paymentSignature: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true,
    unique: false
  }
})

const InvoiceQueue = mongoose.model('InvoiceQueue', InvoiceQueueSchema);

export { InvoiceQueue }