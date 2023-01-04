import { Request, Response } from 'express';
import { PaymentRequest } from '../models/Request';

export const newRequest = async (req: Request, res: Response) => {
  const data = req.body;
  const requiredKeys = ['link', 'from', 'to', 'amount', 'token'];
  const missingKeys = requiredKeys.filter(key => !data[key]);
  if (missingKeys.length > 0) {
    res.status(400).json({ detail: 'Missing Parameters' });
    return;
  }
  const newRequest = new PaymentRequest({ ...data, status: 'sent' });
  try {
    const saved = await newRequest.save();
    res.status(200).json({ detail: 'Request created' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ detail: 'Something went wrong' });
  }
}

export const payRequest = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const requiredKeys = ['_id', 'txid'];
    const missingKeys = requiredKeys.filter(key => !data[key]);
    if (missingKeys.length > 0) {
      res.status(400).json({ detail: 'Missing Parameters' });
      return;
    }
    const found = await PaymentRequest.findById(data._id);
    if (!found) {
      res.status(404).json({ detail: 'Request not found' });
      return;
    }
    const updated = await PaymentRequest.updateOne({ _id: data._id }, {
      $set: {
        status: `paid: ${data.txid}`
      }
    });
    if (updated.modifiedCount > 0) {
      res.status(200).json({ detail: 'Request updated' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ detail: 'Something went wrong' });
  }
}

export const getAllRequest = async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params;
    const requests = await PaymentRequest.find({ to: publicKey }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ detail: 'Something went wrong' });
  }
}