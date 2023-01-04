import AWS from 'aws-sdk'
import { loadEnvConfig } from '@next/env'

loadEnvConfig('./', process.env.NODE_ENV !== 'production')

type Email = {
  to: string,
  from: string,
  subject: string,
  text?: string,
  html?: string
}

const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION
};

const params = (email: Email) => ({
  Source: email.from,
  Destination: {
    ToAddresses: [
      email.to
    ]
  },
  ReplyToAddresses: [
    'help@wagmi.bio'
  ],
  Message: {
    Body: {
      Text: {
        Charset: "UTF-8",
        Data: email.text ? email.text : ''
      },
      Html: {
        Charset: "UTF-8",
        Data: email.html ? email.html : ''
      }
    },
    Subject: {
      Charset: 'UTF-8',
      Data: email.subject
    }
  }
});

export const sendMail = (email: Email, callback: () => any): void => {
  const emailParams = params(email)
  new AWS.SES(SESConfig).sendEmail(emailParams).promise().then((res) => {
    if (res.MessageId) {
      callback()
    }
  });
}