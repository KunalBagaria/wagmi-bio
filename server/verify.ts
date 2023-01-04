import nacl from 'tweetnacl'
import crypto from 'crypto'
import { Request, Response } from 'express'
import { User } from '../models/User'
import { PublicKey } from '@solana/web3.js'

export const oneTimePassword = () => {
  const randBytes = crypto.randomBytes(16).toString('base64');
  return randBytes
}

export const updateOTP = (req: Request, res: Response) => {
  if (req.body.publicKey) {
    const publicKey = req.body.publicKey
    try {
      User.findOne({ publicKey: publicKey }).then((results: any) => {
        if (results) {
          User.updateOne({ publicKey: publicKey }, { otp: oneTimePassword() }).then((updated: any) => {
            if (updated.modifiedCount === 1) {
              User.findOne({ publicKey: publicKey }).then((exists: any) => {
                res.status(200).json({ otp: exists.otp })
              })
            } else {
              res.status(500).json({ detail: 'An unknown error occured' })
            }
          })
        } else {
          new User({ publicKey: publicKey, otp: oneTimePassword() }).save().then((saved: any) => {
            res.status(200).json({ otp: saved.otp })
          })
        }
      })
    } catch (e: any) {
      res.status(500).json({ detail: e })
    }
  } else {
    res.status(400).json({ detail: 'Missing public key' })
  }
}

export const verifyUser = async (req: Request) => {
  if (!req.body.signature || !req.body.publicKey) return;
  const signature = new Uint8Array(req.body.signature.signature.data)
  const stringPublicKey = req.body.publicKey
  const publicKey = new PublicKey(stringPublicKey).toBytes()
  const result = await User.findOne({ publicKey: stringPublicKey })
  const message = new TextEncoder().encode(result.otp)
  const verified = nacl.sign.detached.verify(message, signature, publicKey)
  const newOTP = await User.updateOne({ publicKey: stringPublicKey }, { otp: oneTimePassword() })
  return verified;
}