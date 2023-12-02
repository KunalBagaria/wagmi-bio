import { Request, Response } from 'express';
import { Link } from '../models/Link'
import { UpgradeQueue } from '../models/UpgradeQueue'
import { Transaction } from '../models/Transactions'
import { Invoice } from '../models/Invoice'
import { sendNewRegistration, sendNewTransaction } from './webhook';
import { verifyUser, oneTimePassword } from './verify';
import { validateReservedLink } from '../components/ValidateLink'
import {
  validateDescription,
  validateName,
  validateBackground
} from '../util/validate'

const returnOneYearDate = () => {
  return new Date(new Date().setFullYear(new Date().getFullYear() + 1))
}

const environment: any = process.env['NODE_ENV']
const RPC_URL = 'https://solana-mainnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake';

const verifyPayment = async (signature: string) => {
  const sigs = await fetch(RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://explorer.solana.com'
    },
    body: JSON.stringify({
      method: "getConfirmedSignaturesForAddress2",
      jsonrpc: "2.0",
      params: ["54o5R8Bxwceb5y9Q1nCb3p8eHyDnWDbCNvxptkbaSCi2", {
        limit: 50
      }],
      id: oneTimePassword()
    })
  })
  const data = await sigs.json()
  const recentTransactions = data.result.map((transaction: any) => transaction.signature);
  return recentTransactions.includes(signature)
}

const registerNewUser = (data: any, res: Response, headers: any, bonk: boolean) => {
  new Link({
    link: data.link,
    publicKey: data.publicKey,
    profilePicture: `https://avatars.wagmi.bio/${data.link}`,
    name: data.link,
    description: `Hello, I'm ${data.link} and this is my wagmi link.`,
    background: 'five',
    expires: returnOneYearDate(),
    plan: data.plan,
    paymentSignature: data.signature,
    visits: 0,
    revenue: 0,
    isConfirmed: bonk
  }).save().then((saved: any) => {
    if (saved._id) {
      res.status(200).json({
        success: true
      })
      sendNewRegistration(saved, headers)
    } else {
      console.error(saved);
    }
  }).catch((err: any) => {
    console.error(err);
    res.status(500).json({
      detail: err
    });
  })
}

export const handleDomainRegistration = async (
  req: Request,
  res: Response,
  bonk = false
) => {
  const data = req.body
  const headers = req.headers

  if (!data.signature || !data.publicKey || !data.link || !data.plan) {
    res.status(400).send({
      detail: 'Missing Parameters'
    })
    return;
  }

  const isReserved = validateReservedLink(data.link)

  if (isReserved) {
    res.status(400).json({
      detail: 'Reserved link'
    })
    return
  } else {
    getUserFromDB(data.link).then(async (result: any) => {
      if (result) {
        res.status(400).json({
          detail: 'The link has already been registered'
        })
      } else {
        registerNewUser(data, res, headers, bonk)
      }
    })
  }
}

const registerNewUserEarn = (data: any, res: Response, headers: any) => {
  new Link({
    link: data.link,
    publicKey: data.publicKey,
    profilePicture: `https://avatars.wagmi.bio/${data.link}`,
    name: data.link,
    description: `Hello, I'm ${data.link} and this is my wagmi link.`,
    background: 'five',
    expires: returnOneYearDate(),
    plan: data.plan,
    paymentSignature: data.signature,
    visits: 0,
    revenue: 0,
    isConfirmed: true
  }).save().then((saved: any) => {
    if (saved._id) {
      res.status(200).json({
        success: true
      })
      sendNewRegistration(saved, headers)
    } else {
      console.error(saved);
    }
  }).catch((err: any) => {
    console.error(err);
    res.status(500).json({
      detail: err
    });
  })
}

export const handleEarnDomainRegistration = async (req: Request, res: Response) => {
  const data = req.body
  const headers = req.headers

  if (!data.signature || !data.publicKey || !data.link || !data.plan) {
    res.status(400).send({
      detail: 'Missing Parameters'
    })
    return;
  }

  const isReserved = validateReservedLink(data.link)

  if (isReserved) {
    res.status(400).json({
      detail: 'Reserved link'
    })
    return
  } else {
    getUserFromDB(data.link).then(async (result: any) => {
      if (result) {
        res.status(400).json({
          detail: 'The link has already been registered'
        })
      } else {
        registerNewUserEarn(data, res, headers)
      }
    })
  }
}

const getUserFromDB = async (link: string) => {
  const data = await Link.findOne({
    link: new RegExp(`^${link}$`, 'i')
  })
  return data;
}

export const getUserFromDbPubKey = async (publicKey: string) => {
  const link = await Link.findOne({
    publicKey
  });
  return link
}


const checkIfConfirmed = async (user: { isConfirmed: boolean, paymentSignature: string }) => {
  if (user.isConfirmed === true) return;
  const verified = await verifyPayment(user.paymentSignature)
  if (!verified) return;
  const update = await Link.updateOne({ paymentSignature: user.paymentSignature }, { isConfirmed: true })
    .catch((err) => console.log(err))
  return update
}

const incrementViews = (link: string) => {
  Link.updateOne({ link: link }, { $inc: { visits: 1 } })
    .catch((err) => console.log(err))
}

type TransactionParams = {
  signature: string, from: string, link: string, amount: number, message?: string, token: string, createdAt: Date, amountInUSD: number
}

const incrementRevenue = async (transaction: TransactionParams, req: Request) => {
  const { signature, link, from, createdAt, amount, amountInUSD, message, token } = transaction

  const user = await Link.findOne({ link })
  if (!user) return

  const toSaveTransaction = {
    signature,
    link,
    from,
    to: user.publicKey,
    createdAt,
    amount,
    amountInUSD,
    message,
    token,
    status: 'unconfirmed'
  }

  const newTransaction = new Transaction(toSaveTransaction)

  try {
    const saved = await newTransaction.save()
    sendNewTransaction(saved, req.headers)
  }
  catch (e) {
    console.log(e)
  }
}

export const getUser = async (req: Request, res: Response) => {
  const result = await getUserFromDB(req.params.link)
  if (!result) {
    res.status(404).json({ detail: 'User not found' })
    return
  }
  if (result.isConfirmed || typeof result.isConfirmed === "undefined") {
    res.status(200).json(result)
    incrementViews(result.link)
  } else {
    await checkIfConfirmed(result)
    const user = await getUserFromDB(req.params.link)
    res.status(200).json(user)
  }
}

export const getUserPubKey = async (req: Request, res: Response) => {
  const result = await getUserFromDbPubKey(req.params.publicKey)
  if (!result) {
    res.status(404).json({ detail: 'User not found' })
    return
  }
  if (result.isConfirmed || typeof result.isConfirmed === "undefined") {
    res.status(200).json(result)
    incrementViews(result.link)
  } else {
    await checkIfConfirmed(result)
    const user = await getUserFromDB(req.params.publicKey)
    res.status(200).json(user)
  }
}


export const updateRevenue = (req: Request, res: Response) => {
  const data = req.body;
  if (!data.link || !data.signature || !data.amount || !data.token || !data.from || !data.createdAt) { res.status(400).json({ detail: 'Missing Parameters' }); return }
  incrementRevenue(data, req)
}

export const updateUser = async (req: Request, res: Response) => {
  const data = req.body
  if (!data.publicKey || !data.signature || !data.link) { res.status(400).json({ detail: 'Missing Parameters' }); return }

  const verified = await verifyUser(req)
  if (!verified) { res.status(401).json({ detail: 'Unauthorized' }); return }

  const toUpdateValues: { name?: string, description?: string, profilePicture?: string, background?: string, socials?: [{ name: string, link: string }] } = {}

  if (data.name && !validateName(data.name)) toUpdateValues['name'] = data.name
  if (data.description && !validateDescription(data.description)) toUpdateValues['description'] = data.description
  if (data.profilePicture) toUpdateValues['profilePicture'] = data.profilePicture
  if (data.background && !validateBackground(data.background)) toUpdateValues['background'] = data.background
  if (data.socials) toUpdateValues['socials'] = data.socials.filter((social: any) => social.name && social.link)

  const found = await Link.updateOne({ publicKey: data.publicKey, link: data.link }, { ...toUpdateValues }, { new: true })

  if (found.modifiedCount > 0) {
    res.status(200).json({ success: true })
  } else {
    res.status(500).json({ detail: 'Something went wrong' })
  }
}

export const getTotalLinks = (res: Response) => {
  Link.countDocuments({}).then((count: number) => {
    res.status(200).json({ count })
  }).catch((err: any) => {
    res.status(500).json({ detail: err })
  })
}

export const getTotalRevenue = async (res: Response) => {
  try {
    const basicLinks = await Link.countDocuments({ plan: 1 });
    const premiumLinks = await Link.countDocuments({ plan: 2 });
    const totalRevenue = basicLinks + (premiumLinks * 10);
    res.status(200).json({ totalRevenue })
  } catch (e) {
    res.status(500).json({ detail: e })
  }
}

export const getTotalAccepted = async (res: Response) => {
  try {
    const linkRevenue = await Link.aggregate([{
      $group: {
        _id: null,
        total: { $sum: "$revenue" }
      }
    }])
    const invoiceRevenue = await Invoice.aggregate([
      { $match: { status: /paid/g } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ])
    const total = linkRevenue[0].total + invoiceRevenue[0].total
    res.status(200).json({ total })
  } catch (e) {
    res.status(500).json({ detail: e })
  }
}

export const upgradeUser = async (req: Request, res: Response) => {
  const data = req.body
  if (!data.paymentSignature || !data.link) { res.status(400).json({ detail: 'Missing Parameters' }); return }

  const addToQueue = new UpgradeQueue({ paymentSignature: data.paymentSignature, link: data.link })
  try {
    const saved = await addToQueue.save()
    res.status(200).json(saved)
  } catch (e) {
    res.status(500).json({ detail: `Something went wrong: ${e}` })
  }
}

export const removeLink = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data.link || !data.paymentSignature) { res.status(400).json({ detail: 'Missing Parameters' }); return }
  const link = await Link.findOne({ link: data.link });
  if (!link) { res.status(404).json({ detail: 'Link not found' }); return }
  const confirmed = await verifyPayment(data.paymentSignature);
  if (confirmed || link.isConfirmed) {
    res.status(400).json({ detail: 'Link is already confirmed' });
    return
  }
  try {
    const removed = await Link.deleteOne({ link: data.link });
    res.status(200).json({ success: true })
  } catch (err) { res.status(500).json({ detail: err }) }
}