import express, {
  Request,
  Response
} from "express";
import next from "next";
import mongoose from "mongoose";
import { apiHandler } from "./routes"
import { sentryInit } from "./sentry";
import cors from 'cors';

const environment: any = process.env['NODE_ENV']
const dev = environment !== "production";
const app = next({
  dev
});

const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();
    sentryInit();
    const server = express();
    server.use(cors())
    server.use(express.json());

    apiHandler(server);

    server.use((req: Request, res: Response) => {
      return handle(req, res);
    });    server.listen(port, (err ? : any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
      const MONGO_URL: any = process.env['MONGO_URL']
      mongoose.connect(MONGO_URL, {
        keepAlive: true
      });
      mongoose.connection.on('error', err => {
        console.log(err);
        process.exit(1);
      });
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();