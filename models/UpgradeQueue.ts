import mongoose from 'mongoose'

const UpgradeQueueSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    unique: true
  },
  paymentSignature: {
    type: String,
    required: true,
    unique: true
  }
})

const UpgradeQueue = mongoose.model('UpgradeQueue', UpgradeQueueSchema)

export { UpgradeQueue }