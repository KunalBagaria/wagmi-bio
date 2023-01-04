import axios from 'axios'
import Queue from 'promise-queue';
import { UserWebhook } from '../models/Webhooks';
import { verifyUser } from './verify';
import { Request, Response } from 'express'
import { Invoice } from '../types'
import { Link } from '../models/Link';

type SavedUser = {
  name: string,
  link: string,
  profilePicture: string,
  plan: number,
  publicKey: string,
  paymentSignature: string
}

export const handleWebhookUpdate = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const requiredParameters = ['signature', 'publicKey', 'discord'];
    const missingParameters = requiredParameters.filter(param => !data[param]);
    if (missingParameters.length > 0) {
      return res.status(400).json({
        error: `Missing parameters: ${missingParameters.join(', ')}`
      });
    }
    const verified = verifyUser(req);
    if (!verified) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }
    const user = await UserWebhook.findOne({ publicKey: data.publicKey });
    if (!user) {
      const newUser = new UserWebhook({
        publicKey: data.publicKey,
        discord: data.discord
      })
      await newUser.save();
    } else {
      user.discord = data.discord;
      await user.save();
    }
    return res.status(200).json({
      success: true
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e
    });
  }
}

export const sendNewRegistration = async (user: SavedUser, headers: any) => {
  const WEBHOOK_URL = process.env.REGISTRATION_WEBHOOK;
  axios.post(WEBHOOK_URL, {
    content: "",
    embeds: [{
      url: `https://wagmi.bio/${user.link}`,
      title: "New registration",
      color: 38655,
      fields: [{
        name: `wagmi.bio/${user.link}`,
        value: user.publicKey
      }, {
        name: "Payment Signature",
        value: user.paymentSignature,
      }, {
        name: `IP: ${headers['cf-connecting-ip']}`,
        value: `Country: ${headers['cf-ipcountry']}`
      }, {
        name: "Plan",
        value: user.plan === 1 ? 'Basic' : 'Professional'
      }],
      image: {
        url: `https://wagmi-og.up.railway.app/random/gradient?nonce=${Date.now()}`
      }
    }]
  })
  .catch(err => console.error(err.toJSON()))
}

export const sendNewInvoice = async (invoice: Invoice, headers: any) => {
  const WEBHOOK_URL = process.env.INVOICE_WEBHOOK;
  axios.post(WEBHOOK_URL, {
    content: "",
    embeds: [{
      url: `https://wagmi.bio/invoice/${invoice.invoiceNumber}`,
      title: "New Invoice",
      color: 38655,
      fields: [{
        name: `wagmi.bio/${invoice.link}`,
        value: invoice.publicKey
      }, {
        name: "Amount",
        value: `$${invoice.amount}`,
      }, {
        name: `Client Name: ${invoice.client.name}`,
        value: `Client Email: ${invoice.client.email}`
      }, {
        name: `IP: ${headers['cf-connecting-ip']}`,
        value: `Country: ${headers['cf-ipcountry']}`
      }],
      image: {
        url: `https://wagmi-og.up.railway.app/random/gradient?nonce=${Date.now()}`
      }
    }]
  })
  .catch(err => console.error(err.toJSON()))
}

export const sendNewTransaction = async (transaction: any, headers: any) => {
  const queue = new Queue(1, Infinity);
  const userLink = await Link.findOne({ link: transaction.link })
  const user = await UserWebhook.findOne({ publicKey: userLink.publicKey })
  const WEBHOOKS = [process.env.PAYMENT_WEBHOOK]
  if (user && user?.discord) WEBHOOKS.push(user.discord)
  queue.add(async () => {
    WEBHOOKS.forEach((url) => {
      axios.post(url, {
        content: "",
        username: "Wagmi Transactions",
        avatar_url: "https://i.imgur.com/aCECDTI.jpg",
        embeds: [{
          url: `https://solscan.io/tx/${transaction.signature}`,
          title: "New Transaction",
          color: 38655,
          fields: [{
            name: `wagmi.bio/${transaction.link}`,
            value: transaction.to
          }, {
            name: "From",
            value: transaction.from
          }, {
            name: "Amount",
            value: `$${transaction.amountInUSD}`,
          }, {
            name: `Token: ${transaction.token}`,
            value: `Token Amount: ${transaction.amount}`
          }, {
            name: 'Message',
            value: transaction.message || 'No Message'
          }, {
            name: `IP: ${headers['cf-connecting-ip']}`,
            value: `Country: ${headers['cf-ipcountry']}`
          }],
          image: {
            url: `https://wagmi-og.up.railway.app/random/gradient?nonce=${Date.now()}`
          }
        }]
      })
      .catch(err => console.error(err.toJSON()))
    })
  })
}