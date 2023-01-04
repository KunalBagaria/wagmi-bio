import { Link } from '../models/Link'
import { Request, Response } from 'express'

export const getAllLinks = (req: Request, res: Response) => {
  Link.find({ publicKey: req.params.key }).then((result: any) => {
    if (result) {
      res.status(200).json(result)
    } else {
      res.status(404).json({ detail: 'No links found' })
    }
  })
}