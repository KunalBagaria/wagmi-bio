import { InvoiceTypes } from 'types'
import { InvoicePayment } from './InvoicePayment';
import { generateInvoice } from '@/components/GenerateInvoice';
import pdfIcon from '@/images/icons/pdf.svg'
import date from 'date-and-time'
import invoiceIcon from '@/images/icons/invoice-purple.svg'
import styles from '@/styles/Invoice.module.scss'
import toast from 'react-hot-toast';

export const InvoiceComponent = ({ invoice, link, price, dummy }: InvoiceTypes) => {

  const total = invoice.particulars.reduce((acc: any, curr: any) => acc + curr.price * curr.quantity, 0)
  const copyLink = () => {
    navigator.clipboard.writeText(`https://wagmi.bio/invoice/${invoice.invoiceNumber}`)
    toast.success('Invoice link copied')
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(invoice.client.email)
    toast.success('Email copied')
  }

  return (
    <div className={styles.invoice}>
      <div className={styles.invoiceComponentBox}>
        <div className={styles.topGraySection} />
        <img src={invoiceIcon.src} alt="" className={styles.invoiceIcon} />
        <div className={styles.paddedContentContainer}>

          <div className={styles.componentSpaceBetweenFlex}>
            <div>
              <p className={styles.lightGrayText}>INVOICE NO.</p>
              <p className={styles.invoiceNumber}>#{invoice.invoiceNumber}</p>
            </div>
            <div className={styles.componentSpaceBetweenFlex} style={{ width: '45%' }}>
              <div>
                <p className={styles.lightGrayText}>ISSUED ON</p>
                <p className={styles.darkGrayText}>{date.format(new Date(invoice.createdAt), 'MMM DD YYYY')}</p>
              </div>
              <div>
                <p className={styles.lightGrayText}>DUE ON</p>
                {invoice.dueDate && (
                  <p className={styles.darkGrayText}>{date.format(new Date(invoice.dueDate), 'MMM DD YYYY')}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.spacer} />

          <div className={styles.componentSpaceBetweenFlex}>

            <div>
              <p className={styles.lightGrayText}>CHARGED BY</p>
              <div className={styles.invoiceProfile}>
                <img src={link.profilePicture} alt="" />
                <div className={styles.profileText}>
                  <p className={styles.darkText}>{link.name}</p>
                  <p className={styles.darkGrayText}>wagmi.bio/{link.link}</p>
                </div>
              </div>
            </div>

            <div>
              <p className={styles.lightGrayText}>CLIENT DETAILS</p>
              <div className={styles.clientProfile}>
                <p className={styles.darkText}>{invoice.client.name}</p>
                <p style={{ cursor: 'pointer' }} onClick={copyEmail} className={styles.darkGrayText}>{invoice.client.email}</p>
                <p className={styles.darkGrayText}>{invoice.client.address}</p>
              </div>
            </div>

          </div>

          <div className={styles.spacer} />

          <div className={styles.particularsGrid}>
            <p>Item</p>
            <p>Qty</p>
            <p>Price</p>
            <p>Total</p>
          </div>

        </div>

        <div className={styles.invoiceDivider} />

        <div className={styles.createdInvoiceParticulars}>
          {invoice.particulars.map((particular, index) => (
            <div className={styles.particularsGrid} key={index}>
              <p>{particular.name}</p>
              <p>{particular.quantity}</p>
              <p>${particular.price}</p>
              <p className={styles.createdInvoiceTotal}>${particular.quantity * particular.price}</p>
            </div>
          ))}
        </div>

        <div className={styles.invoiceDivider} />

        <div className={styles.createdInvoiceDefaultPadding}>
          <p className={styles.createdInvoiceFinal}>Total — <span>${total.toLocaleString(undefined, { 'minimumFractionDigits': 0,'maximumFractionDigits': 0 })} USD</span></p>
        </div>

        <div className={styles.createdInvoiceDefaultPadding}>
          <p className={styles.paymentDetailsText}>Payment Details</p>
        </div>

        <div className={styles.invoiceDivider} />

        <div className={styles.invoicePaymentBox}>
          {((invoice.status && !invoice.status.includes('paid')) || !invoice.status) && (
            <InvoicePayment invoiceNumber={invoice.invoiceNumber} link={invoice.link} invoice={invoice} publicKey={invoice.publicKey} dummy={dummy} total={total} price={price} />
          )}

          {invoice.status && invoice.status.includes('paid') && (
            <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0rem', color: '#4D5562', display: 'flex', justifyContent: 'space-between' }}>
              PAID
              <span style={{ cursor: 'pointer' }} onClick={() => generateInvoice(invoice)}><img src={pdfIcon.src} alt="" /></span>
            </p>
          )}

          {/* <div className={styles.componentSpaceBetweenFlex} style={{ marginTop: '1.5rem' }}>
            <p onClick={() => copyLink()} className={styles.invoiceLink}>wagmi.bio/invoice/{invoice.invoiceNumber}</p>
          </div> */}
        </div>

      </div>
    </div>
  )
}