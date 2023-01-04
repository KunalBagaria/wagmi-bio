import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  publicKey: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true,
    unique: false
  }
})

const User = mongoose.model('users', UserSchema)

export { User }