import { InvoiceComponent } from '@/layouts/Invoice'
import { DefaultHead } from '@/layouts/Head'
import { Toaster } from 'react-hot-toast'
import styles from '@/styles/Invoice.module.scss'
import logo from '@/images/black-logo.svg'
import Link from 'next/link'

export default function Invoice(props: any) {
  return (
  <div className={styles.main}>
    <DefaultHead title={`Pay Invoice - ${props.invoice.invoiceNumber}`} />

    <Link href="/">
    <img className={styles.logo} src={logo.src} />
    </Link>
    <InvoiceComponent dummy={false} price={props.price} invoice={props.invoice} link={props.link} />
  </div>
  )
}

export const getServerSideProps = async ({ query }: any) => {

  const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://wagmi.bio'
  const fInvoice = await fetch(`${baseURL}/api/get/invoice/${query.invoice}`)
  const invoice = await fInvoice.json()

  if (!invoice?._id) {
  return {
    redirect: {
    destination: '/404',
    permanent: false
    }
  }
  }

  const user = await fetch(`${baseURL}/api/get/user/${invoice.link}`)
  const userData = await user.json()
  const data = await fetch("https://pricing.wagmi.bio/solana");
  const json = data.ok ? await data.json() : null
  const price = json?.price

  return { props: { // pass invoice data in the props if available
  invoice: invoice,
  link: userData,
  price
  }}
}