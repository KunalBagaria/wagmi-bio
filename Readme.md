<img width="1500" alt="GitHub" src="https://user-images.githubusercontent.com/61944452/159113563-9d303202-5037-45a6-a75d-b344706365f4.png">

***

### Setup

1. Clone this repo
2. Create a .env file in the same directory and fill these up:

```
MONGO_URL=
AWS_SES_SECRET_ACCESS_KEY=
AWS_SES_REGION=
AWS_SES_ACCESS_KEY_ID=
INVOICE_WEBHOOK=
PAYMENT_WEBHOOK=
REGISTRATION_WEBHOOK=
NODE_ENV=<optional>
PORT=<optional>
```

3. Run `yarn`
4. Run `yarn dev`


### Workers:

1. Clone [this](https://github.com/kb24x7/wagmi-worker) repo
2. Create a new .env file in that directory
3. Fill these up:

```
MONGO_URL=
```

4. Run `yarn`
5. Run `yarn watch` and `yarn dev`


### Proxies:

We use a custom price proxy to ensure that we don't hit rate-limits or bot-prevention mechanisms used by Cloudflare in CoinGecko.

1. Clone [this](https://github.com/kb24x7/wagmi-price) repo
2. Fill these up in a .env file in that directory:

```
PORT=<optional>
```

3. Run `yarn`
4. Run `yarn watch` and `yarn dev`
