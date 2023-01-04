import { useState, useEffect } from 'react';
import { validateInvoice } from '@/util/validate'
import { toasterPromise } from '@/util/toasterNetworkPromise'
import { InvoiceComponent } from '@/layouts/Invoice'
import { signOTP, connectWallet } from '@/components/Wallet'
import ClickAwayListener from 'react-click-away-listener'
import dashStyles from '@/styles/Dashboard.module.scss'
import styles from '@/styles/Invoice.module.scss'
import defaults from '@/styles/Defaults.module.scss'
import check from '@/images/icons/check.svg'
import plus from '@/images/icons/blue-plus.svg'
import expandIcon from '@/images/icons/expand.svg'
import toast from 'react-hot-toast'
import date from 'date-and-time'

export const generateInvoiceNumber = ()  => {
  return Number(((Math.random() * (9999999 - 100000)) + 100000).toFixed(0))
}

const tokens = {
  'Select Token': "",
  'Solana': "",
  'USD Coin': "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  'USD Tether': "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  'Bonk Coin': "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
}

export const CreateInvoice = ({ links }: any) => {
  const [price, setPrice] = useState<number>(0)
  const [invoiceNumber] = useState(generateInvoiceNumber())
  const [client, setClient] = useState({
    name: '',
    email: '',
    address: ''
  })
  const [dueDate, setDueDate] = useState<Date>(new Date())
  const [expanded, setExpanded] = useState<boolean>(false)
  const [tokenSelector, setTokenSelector] = useState<boolean>(false)
  const [selectedLink, setSelectedLink] = useState<any>(links[0])
  const [particulars, setParticulars] = useState<any>([{
    name: '',
    quantity: 1,
    price: 0
  }])
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    fetch("https://pricing.wagmi.bio/solana")
      .then((res) => res.json())
      .then((data) => {
        setPrice(data.price)
      })
      .catch((err) => console.error(err))
  }, [])

  const invoiceData = {
    client,
    publicKey: '',
    createdAt: new Date(),
    link: selectedLink.link,
    // @ts-expect-error
    token: tokens[token],
    dueDate: dueDate,
    particulars,
    invoiceNumber,
    amount: particulars.reduce((acc: any, curr: any) => acc + curr.price * curr.quantity, 0)
  }

  const handleSubmit = async () => {
    const errored = validateInvoice(invoiceData)
    if (errored) return;
    const buff = await connectWallet()
    const signature = await signOTP()
    const data = {
      invoice: {...invoiceData, publicKey: buff.toString()},
      publicKey: buff.toString(),
      signature,
      link: selectedLink.link,
    }
    const request = fetch('/api/invoice/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    toast.promise(toasterPromise(request), {
      loading: 'Creating Invoice',
      success: 'Invoice Created',
      error: 'There was an error creating the invoice'
    })

    const response = await request
    const saved = await response.json()
    console.log(saved)
    if (saved?._id) {
      window.location.href = `/invoice/${saved.invoiceNumber}`
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <div className={defaults.paddedContainer} style={{ display: 'flex' }}>

        <div className={styles.invoiceInputContainer}>
          <div className={styles.spaceBetweenFlex}>
            <div>
              <p className={dashStyles.dashboardHeading}>Create Invoice</p>
              <p className={dashStyles.dashboardSubHeading}>Get paid from anywhere</p>
            </div>
            <button onClick={handleSubmit}className={defaults.lightBlueBtn}>
              <span><img src={check.src} /></span>
              SEND
            </button>
          </div>

          <form id="invoiceForm" className={styles.invoiceForm}>
            <div className={styles.spaceBetweenFlex}>
              <div className={styles.inputSection}>
                <p className={defaults.grayLabel}>Client Name</p>
                <input maxLength={40} onChange={(e) => setClient({ ...client, name: e.target.value })} className={defaults.grayInput} placeholder="Enter Client Name" />
              </div>
              <div className={styles.inputSection}>
                <p className={defaults.grayLabel}>Client Email</p>
                <input maxLength={40} onChange={(e) => setClient({...client, email: e.target.value })} type="email" className={defaults.grayInput} placeholder="Enter Client Email" />
              </div>
            </div>

            <div className={styles.fullWidthSection}>
              <p className={defaults.grayLabel}>Address</p>
              <input maxLength={40} onChange={(e) => setClient({ ...client, address: e.target.value })} className={defaults.grayInput} placeholder="Enter Client Address" />
            </div>

            <ClickAwayListener onClickAway={() => setExpanded(false)} className={styles.fullWidthSection}>
              <div className={styles.fullWidthSection}>
                <p className={defaults.grayLabel}>Select Link</p>
                <div className={defaults.linkInput} onClick={() => setExpanded(!expanded)}>
                  <p>wagmi.bio/{selectedLink.link}</p>
                  <img src={expandIcon.src} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.12s linear' }} alt="" />
                </div>
                <div style={{ display: expanded ? 'flex' : 'none' }} className={defaults.linkSelector}>
                  {links.map((link: any, index: number) => (
                    <p key={index} onClick={() => {
                      setSelectedLink(link)
                      setExpanded(false)
                    }}>wagmi.bio/{link.link}</p>
                  ))}
                </div>
              </div>
            </ClickAwayListener>

            <ClickAwayListener onClickAway={() => setTokenSelector(false)} className={styles.fullWidthSection}>
              <div className={styles.fullWidthSection}>
                <p className={defaults.grayLabel}>Restrict Token (optional)</p>
                <div className={defaults.linkInput} onClick={() => setTokenSelector(!tokenSelector)}>
                  <p>{token ? token : 'Select Token'}</p>
                  <img src={expandIcon.src} style={{ transform: tokenSelector ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.12s linear' }} alt="" />
                </div>
                <div style={{ display: tokenSelector ? 'flex' : 'none' }} className={defaults.linkSelector}>
                  {Object.keys(tokens).map((token: string, index: number) => (
                    <p key={index} onClick={() => {
                      setToken(token)
                      setTokenSelector(false)
                    }}>{token}</p>
                  ))}
                </div>
              </div>
            </ClickAwayListener>

            <div className={styles.spaceBetweenFlex}>
              <div className={styles.inputSection}>
                <p className={defaults.grayLabel}>Issed on</p>
                <input disabled className={defaults.grayInput} value={date.format(new Date(), 'MMM DD YYYY')} />
              </div>
              <div className={styles.inputSection}>
                <p className={defaults.grayLabel}>Due Date</p>
                <input value={date.format(dueDate, 'YYYY-MM-DD')} onChange={(e: any) => {
                  setDueDate(e.target.value ? new Date(e.target.value) : new Date())
                }} type="date" className={defaults.grayInput} />
              </div>
            </div>

            <div className={styles.fullWidthSection}>
              <div className={styles.particularsGrid}>
                <p>Item</p>
                <p>Qty</p>
                <p>Price</p>
                <p>Total</p>
              </div>
              <div className={styles.divider} />
            </div>

            <div className={styles.fullWidthSection} style={{ marginTop: '0.25rem' }}>
              {particulars.map((particular: any, index: number) => (
                <div className={styles.particularsGrid} key={index}>
                  <input onChange={(e: any) => setParticulars([...particulars.slice(0, index), { ...particular, name: e.target.value }, ...particulars.slice(index + 1)])} className={defaults.grayInput} placeholder="Item Name" />
                  <input onChange={(e: any) => setParticulars([...particulars.slice(0, index), { ...particular, quantity: Number(e.target.value) }, ...particulars.slice(index + 1)])} className={defaults.grayInput} placeholder="Qty" value={particular.quantity} />
                  <input onChange={(e: any) => setParticulars([...particulars.slice(0, index), { ...particular, price: Number(e.target.value) }, ...particulars.slice(index + 1)])} className={defaults.grayInput} placeholder="Price" type="number" />
                  <input disabled className={defaults.grayInput} value={`$${particular.quantity * particular.price}`} />
                </div>
              ))}
            </div>

            <div className={styles.spaceBetweenFlex}>
              {particulars.length < 15 && (
                <div className={styles.addButton} onClick={(e) => {
                  e.preventDefault()
                  setParticulars([...particulars, { name: '', quantity: 1, price: 0 }])
                }}>
                  <img src={plus.src} />
                  <span>ADD NEW</span>
                </div>
              )}
              <p className={styles.total}>Total — ${particulars.reduce((acc: number, particular: any) => acc + particular.quantity * particular.price, 0).toLocaleString(undefined, { 'minimumFractionDigits': 0,'maximumFractionDigits': 0 })}</p>
            </div>

          </form>

        </div>

        <div className={styles.invoicePreview}>
          <div className={styles.invoiceBackground} />
          <InvoiceComponent dummy={true} link={selectedLink} price={price} invoice={invoiceData} />
        </div>

      </div>


    </div>
  )
}