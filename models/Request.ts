import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    unique: false
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
  createdAt: {
    type: Date,
    required: true,
    unique: false,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    unique: false
  }
});

const PaymentRequest = mongoose.model('PaymentRequest', RequestSchema);

export { PaymentRequest };