import {
  Request,
  Response
} from 'express'
import { Keypair } from '@solana/web3.js'
import { returnEmail } from '../components/InvoiceEmail'
import { validateInvoice } from '../util/validate'
import { InvoiceQueue } from '../models/InvoiceQueue'
import { Invoice } from '../models/Invoice'
import { Link } from '../models/Link'
import { verifyUser } from './verify'
import { sendMail } from './email'
import { sendNewInvoice } from './webhook'

export const sendInvoiceMail = async (invoice: any) => {
  const owner = await Link.findOne({ link: invoice.link })
  const invoiceEmail = {
    to: invoice.client.email,
    from: 'Wagmi Invoicing <invoicing@wagmi.bio>',
    subject: `Invoice #${invoice.invoiceNumber}`,
    html: returnEmail(invoice, owner)
    // text: `Dear ${invoice.client.name},\n\nYou have an unpaid invoice from ${owner.name} for $${invoice.amount}. https://wagmi.bio/invoice/${invoice.invoiceNumber}\n\nRegards,\nWagmi Team`,
  }
  sendMail(invoiceEmail, async () => {
    console.log('Email sent to ', invoice.client.email)
    const updated = await Invoice.updateOne({ invoiceNumber: invoice.invoiceNumber }, { status: 'sent' })
  })
}

export const createNewInvoice = async (req: Request, res: Response) => {
  const data = req.body
  if (!data.publicKey || !data.signature || !data.link || !data.invoice) { res.status(400).json({ detail: 'Missing Parameters' }); return }

  const verified = await verifyUser(req)
  if (!verified) { res.status(401).json({ detail: 'Unauthorized' }); return }

  const errored = validateInvoice(data.invoice)

  if (errored) { res.status(400).json({ detail: 'Invalid Parameters' }); return }

  const newInvoice = new Invoice({
    ...data.invoice,
    status: 'pending',
    reference: new Keypair().publicKey.toBase58()
  })

  const saved = await newInvoice.save()

  if (saved._id) {
    res.status(200).json(saved)
    if (!data.link.startsWith("superteamearn")) {
      sendInvoiceMail(saved)
    }

    sendNewInvoice(saved, req.headers)
  } else {
    res.status(500).json({ detail: 'Error creating invoice' })
  }
}

export const getInvoice = async (req: Request, res: Response) => {
  const id = req.params.id
  if (!id) { res.status(400).json({ detail: 'Missing Parameters' }); return }

  const fInvoice = await Invoice.findOne({ invoiceNumber: id })
    .catch(err => {
      res.status(404).json({ detail: 'Invoice not found' })
      return
    })

  res.status(200).json(fInvoice)
}

export const addInvoiceToQueue = async (req: Request, res: Response) => {
  const data = req.body
  if (!data.paymentSignature || !data.token || !data.invoiceNumber) { res.status(400).json({ detail: 'Missing Parameters' }); return }
  new InvoiceQueue({ invoiceNumber: data.invoiceNumber, token: data.token, paymentSignature: data.paymentSignature }).save().then(() => {
    res.status(200).json({ detail: 'Invoice added to queue' })
  }).catch((err: any) => {
    res.status(500).json({ detail: `Error while adding invoice to queue: ${err}` })
  })
}

export const getAllInvoices = async (req: Request, res: Response) => {
  const owner = req.params.owner;
  if (!owner) { res.status(400).json({ detail: 'Missing Parameters' }); return }

  const invoices = await Invoice.find({ publicKey: owner }).sort({ createdAt: -1 })
  res.status(200).json(invoices)
}