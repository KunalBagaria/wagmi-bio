import { useRouter } from 'next/router'
import { generateInvoice } from '@/components/GenerateInvoice'
import date from 'date-and-time'
import toast from 'react-hot-toast'
import solanaIcon from '@/images/icons/solana.svg'
import invoiceIcon from '@/images/icons/invoice-preview.svg'
import pdfIcon from '@/images/icons/pdf.svg'
import styles from '@/styles/Invoice.module.scss'
import dashStyles from '@/styles/Dashboard.module.scss'
import defaults from '@/styles/Defaults.module.scss'

export type InvoiceType = {
  client: {
    name: string,
    address: string,
    email: string
  },
  status: string,
  link: string,
  publicKey: string,
  dueDate: Date,
  createdAt: Date,
  particulars: { name: string; quantity: number; price: number; }[],
  invoiceNumber: number,
  amount: number
}

type Props = {
  price: number,
  invoices: InvoiceType[];
}

export const UserInvoices = (props: Props) => {
  const router = useRouter()
  const { invoices } = props

  const statusColors = {
    pending: { name: 'Pending', textColor: '#B17E61', background: 'rgba(247, 212, 193, 0.21)' },
    paid: { name: 'Paid', textColor: '#274C40', background: 'rgba(0, 209, 140, 0.21)' },
    sent: { name: 'Sent', textColor: '#2652D0', background: 'rgba(157, 200, 251, 0.2)' }
  }

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    toast.success('Email copied')
  }

  const returnStatus = (invoice: any) => {
    const cleanStatus = invoice.status.includes(':') ? invoice.status.split(':')[0] : invoice.status
    // @ts-expect-error
    const status = statusColors[cleanStatus]
    return status
  }

  const paymentSignature = (invoice: any) => {
    const signature = invoice.status.includes(':') ? invoice.status.split(':')[1].trim() : invoice.status
    return signature
  }

  return (
    <div className={defaults.paddedContainer}>
      <div className={defaults.spaceBetweenFlex}>
        <div>
          <p className={dashStyles.dashboardHeading}>Invoices</p>
          <p className={dashStyles.dashboardSubHeading}>Bill anyone in the world</p>
        </div>
        <button onClick={() => router.push('/dashboard/invoice/new')} className={defaults.lightBlueBtn}>CREATE</button>
      </div>

      <div className={styles.invoicesContainer}>
        <div className={styles.invoicesHeader}>
          <div className={styles.invoicesDetailsGrid}>
            <p className={styles.invoicesLightTexts}>Client</p>
            <p className={styles.invoicesLightTexts}>Invoice No.</p>
            <p className={styles.invoicesLightTexts}>Amount</p>
            <p className={styles.invoicesLightTexts}>Issued</p>
            <p className={styles.invoicesLightTexts}>Status</p>
            <p className={styles.invoicesLightTexts}>Actions</p>
          </div>
        </div>
        <div className={styles.invoicesDetailsContainer}>
          {invoices.map((invoice, index) => (
            <div key={index} className={styles.invoicesDetailsGrid}>
              <div className={defaults.spaceBetweenFlex}>
                <img src={invoiceIcon.src} alt="" />
                <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '2rem', height: '90%' }}>
                  <p className={styles.invoicesDarkText}>{invoice.client.name}</p>
                  <p style={{ cursor: 'pointer' }} onClick={() => copyEmail(invoice.client.email)} className={styles.invoicesLightTexts}>{invoice.client.email}</p>
                </div>
              </div>

              <p className={styles.invoicesDarkText}>#{invoice.invoiceNumber}</p>

              <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', height: '90%' }}>
                <p className={styles.invoicesDarkText} style={{ fontWeight: 700 }}>
                  {(invoice.amount / props.price).toFixed(2)} SOL
                  <span className={styles.invoicesSolIcon}>
                    <img src={solanaIcon.src} alt="" />
                  </span>
                </p>
                <p style={{ fontSize: '0.85rem' }} className={styles.invoicesLightTexts}>${invoice.amount.toLocaleString(undefined, { 'minimumFractionDigits': 0,'maximumFractionDigits': 0 })} USD</p>
              </div>

              <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', height: '90%' }}>
                <p className={styles.invoicesLightTexts}>{date.format(new Date(invoice.createdAt), 'MMM DD, YYYY')}</p>
                <p style={{ fontSize: '0.85rem' }} className={styles.invoicesLightTexts}>{date.format(new Date(invoice.createdAt), 'hh:mm A')}</p>
              </div>

              <div style={{ color: returnStatus(invoice).textColor, background: returnStatus(invoice).background }} className={styles.statusBox}>
                <p>{returnStatus(invoice).name}</p>
              </div>

              <div className={defaults.spaceBetweenFlex}>
                <span style={{ cursor: 'pointer' }} onClick={() => generateInvoice(invoice)}>
                  <img src={pdfIcon.src} alt="" />
                </span>
                <span className={styles.darkBlueText} style={{ cursor: 'pointer' }} onClick={() => router.push(`/invoice/${invoice.invoiceNumber}`)}>VIEW</span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}