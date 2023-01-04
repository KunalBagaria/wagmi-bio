import mongoose from 'mongoose';

const WebhookSchema = new mongoose.Schema({
  publicKey: {
    type: String,
    required: true,
    unique: true
  },
  discord: {
    type: String,
    required: false,
    unique: false
  }
})

const UserWebhook = mongoose.model('webhooks', WebhookSchema);

export { UserWebhook }