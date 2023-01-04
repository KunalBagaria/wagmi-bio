import rateLimit from "express-rate-limit"
import { Request, Response } from 'express';
import { getAllLinks } from "./dashboard"
import {
  handleDomainRegistration,
  updateUser,
  getUser,
  updateRevenue,
  getTotalAccepted,
  getTotalLinks,
  getTotalRevenue,
  upgradeUser,
  removeLink,
  handleEarnDomainRegistration,
  getUserPubKey
} from "./domain";
import { updateOTP } from './verify';
import { createNewInvoice, getInvoice, addInvoiceToQueue, getAllInvoices } from './invoice';
import { getTransactions } from './transaction';
import { newRequest, getAllRequest, payRequest } from './requests';
import { handleWebhookUpdate } from './webhook';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500
});

const newRegistrationLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 200
});

const invoiceLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 50
});

export const apiHandler = (server: any) => {

  server.get("/api/get/links/:key", limiter, (req: Request, res: Response) => {
    getAllLinks(req, res);
  })

  server.post("/api/otp", limiter, (req: Request, res: Response) => {
    updateOTP(req, res);
  })

  server.post("/api/register", newRegistrationLimiter, (req: Request, res: Response) => {
    console.log(`Registration started for ${req.body.link} by ${req.body.publicKey}`);
    handleDomainRegistration(req, res)
  });

  server.post("/api/register_bonk", newRegistrationLimiter, (req: Request, res: Response) => {
    console.log(`Registration started for ${req.body.link} by ${req.body.publicKey}`);
    handleDomainRegistration(req, res, true)
  });

  server.post("/api/register/earn", newRegistrationLimiter, (req: Request, res: Response) => {
    console.log(`Superteam Earn | Registration started for ${req.body.link} by ${req.body.publicKey}`);
    handleEarnDomainRegistration(req, res)
  });

  server.post("/api/request/new", limiter, (req: Request, res: Response) => {
    newRequest(req, res);
  })

  server.post("/api/request/pay", limiter, (req: Request, res: Response) => {
    payRequest(req, res);
  })

  server.post("/api/webhook/update", limiter, (req: Request, res: Response) => {
    handleWebhookUpdate(req, res);
  })

  server.post("/api/pay", limiter, (req: Request, res: Response) => {
    updateRevenue(req, res);
  })

  server.post("/api/pay/invoice", limiter, (req: Request, res: Response) => {
    addInvoiceToQueue(req, res);
  })

  server.post("/api/invoice/new", invoiceLimiter, (req: Request, res: Response) => {
    createNewInvoice(req, res);
  })

  server.post("/api/update/link", limiter, (req: Request, res: Response) => {
    updateUser(req, res);
  })

  server.post("/api/upgrade/link", limiter, (req: Request, res: Response) => {
    upgradeUser(req, res);
  })

  server.get("/api/get/invoice/:id", limiter, (req: Request, res: Response) => {
    getInvoice(req, res);
  })

  server.get("/api/get/invoices/:owner", limiter, (req: Request, res: Response) => {
    getAllInvoices(req, res)
  })

  server.get("/api/get/transactions/:publicKey", limiter, (req: Request, res: Response) => {
    getTransactions(req, res);
  })

  server.get("/api/get/requests/:publicKey", limiter, (req: Request, res: Response) => {
    getAllRequest(req, res);
  })

  server.get("/api/get/user/:link", limiter, (req: Request, res: Response) => {
    getUser(req, res);
  })

  server.get("/api/get/user/publickey/:publicKey", limiter, (req: Request, res: Response) => {
    getUserPubKey(req, res);
  })

  // server.post("/api/remove/user/", limiter, (req: Request, res: Response) => {
  //   removeLink(req, res);
  // })

  server.get("/api/get/total/links", limiter, (req: Request, res: Response) => {
    getTotalLinks(res);
  })

  server.get("/api/get/total/accepted", limiter, (req: Request, res: Response) => {
    getTotalAccepted(res);
  })

  server.get("/api/get/total/revenue", limiter, (req: Request, res: Response) => {
    getTotalRevenue(res);
  })
}