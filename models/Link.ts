import mongoose from 'mongoose'

const LinkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String,
    required: true,
    unique: false
  },
  name: {
    type: String,
    required: true,
    unique: false
  },
  description: {
    type: String,
    required: true,
    unique: false
  },
  background: {
    type: String,
    required: true,
    unique: false
  },
  plan: {
    type: Number,
    required: true,
    unique: false
  },
  expires: {
    type: Date,
    required: true,
    unique: false
  },
  publicKey: {
    type: String,
    required: true,
    unique: false
  },
  visits: {
    type: Number,
    required: false,
    unique: false
  },
  paymentSignature: {
    type: String,
    required: false,
    unique: true
  },
  revenue: {
    type: Number,
    required: false,
    unique: false
  },
  isConfirmed: {
    type: Boolean,
    required: true,
    unique: false
  },
  createdAt: {
    type: Date,
    required: false,
    unique: false,
    default: Date.now
  },
  verified: {
    type: Boolean,
    required: false,
    unique: false
  },
  socials: [
    { name: String, link: String }
  ]
})

const Link = mongoose.model('Links', LinkSchema)

export { Link }