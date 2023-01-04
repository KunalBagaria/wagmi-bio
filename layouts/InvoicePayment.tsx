import { useState, useEffect, useRef, MutableRefObject } from "react"
import { PublicKey } from "@solana/web3.js"
import { sendMoney } from "@/components/Wallet"
import { sendSPL } from '@/components/SendSPL'
import { getTokenPrice } from '@/util/getTokenPrice'
import { toasterPromise } from '@/util/toasterNetworkPromise'
import { incrementRevenue } from '@/components/UpdateRevenue'
import { Invoice } from '../types'
import { generateQRCodeURL, createQR } from "@/components/GenerateQRCode"
import qrIcon from '@/images/icons/qr.svg'
import getWallet from '@/util/whichWallet'
import ClickAwayListener from 'react-click-away-listener';
import styles from "@/styles/Pay.module.scss"
import iStyles from '@/styles/Invoice.module.scss'
import invoiceStyles from '@/styles/Invoice.module.scss'
import sol from "@/images/icons/sol.png"
import usdc from "@/images/icons/usdc.png"
import usdt from "@/images/icons/usdt.png"
import bonk from "@/images/icons/bonk.png"
import downArrow from "@/images/icons/down-arrow.svg"
import toast from "react-hot-toast"
import Modal from 'react-modal';
import cross from '@/images/icons/cross.svg'

type Props = {
  price: number,
  invoiceNumber: number,
  invoice: Invoice,
  total: number,
  link: string,
  dummy: boolean,
  publicKey: string
}

const modalStyles = {
  content: {
    top: '50%',
    padding: '3rem 3rem',
    borderRadius: '1.2rem',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

export const QRCode = ({
  url,
  size = 400
}: {
  url: string,
  size?: number
}) => {
  const qrRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    const qrCodeElement = createQR(url, size);
    (async function () {
      const qre = await qrCodeElement;
      qre.append(qrRef.current);
    })();
    return () => {
      qrRef.current?.children[0].remove();
    }
  }, [url]);

  return (
    <div className={styles.qrCode} ref={qrRef} />
  )
}

export const InvoicePayment = (props: Props) => {

  const tokens = {
    SOL: {
      symbol: 'SOL',
      icon: sol,
      price: props.price
    },
    USDC: {
      symbol: 'USDC',
      icon: usdc,
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      price: 1,
      decimals: 6
    },
    USDT: {
      symbol: "USDT",
      icon: usdt,
      mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      price: 1,
      decimals: 6
    },
    BONK: {
      symbol: "BONK",
      icon: bonk,
      mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      getPrice: async () => getTokenPrice('bonk'),
      decimals: 5
    }
  }

  const [amount, setAmount] = useState<number>(props.total > 0 ? (props.total / props.price) : 0)
  const [token, setToken] = useState<string>('SOL')
  const [expanded, setExpanded] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [qrDataURL, setQRDataURL] = useState<string>('')

  const getMintAddress = () => {
    // @ts-expect-error
    return tokens[token].mint
  }

  const qrData = () => {
    if (!props.invoice.reference) return
    const data = {
      reference: props.invoice.reference,
      amount,
      splToken: props.invoice.token ? props.invoice.token : getMintAddress(),
      recipient: props.publicKey,
      label: 'wagmi.bio',
      memo: 'Payment for invoice #' + props.invoiceNumber,
      message: 'Sending payment to ' + props.invoice.client.name
    }
    const qrCodeURL = generateQRCodeURL(data);
    setQRDataURL(qrCodeURL);
    console.log(qrCodeURL);
  }

  useEffect(() => {
    handleTokenChange(token)
    if (props.invoice.token) {
      // @ts-expect-error
      const selectedToken = Object.keys(tokens).filter((ft) => tokens[ft].mint === props.invoice.token)[0];
      if (!selectedToken) return
      handleTokenChange(selectedToken)
      setToken(selectedToken)
    }
  }, [props.total, token])


  const incrementData = {
    token,
    amount,
    amountInUSD: props.total,
    createdAt: new Date(),
    link: props.link,
    signature: '',
    from: ''
  }

  const handleTokenChange = async (sToken: string) => {
    setExpanded(false)
    // @ts-expect-error
    const selectedToken = tokens[sToken]
    if (selectedToken.price) {
      setToken(sToken)
      setAmount(props.total / selectedToken.price)
      qrData()
    } else if (selectedToken.getPrice) {
      setQRDataURL('')
      setDisabled(true)
      setToken(sToken)
      const fPrice = await selectedToken.getPrice()
      setAmount(props.total / fPrice)
      qrData()
      setDisabled(false)
    }
  }

  const sendPaymentToBackend = async (paymentSignature: string | undefined) => {
    if (!paymentSignature) return
    const wallet = getWallet();
    const from = await wallet.publicKey.toString();
    const invoicePayment = {
      token, invoiceNumber: props.invoiceNumber, paymentSignature
    }
    incrementData.from = from;
    incrementData.signature = paymentSignature;
    incrementRevenue(incrementData)
    const request = fetch('/api/pay/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoicePayment)
    })
    toast.promise(toasterPromise(request), {
      loading: 'Sending Payment',
      success: 'This invoice will be marked as paid as soon as the payment is verified',
      error: 'There was an error sending the payment'
    })
    const response = await request
    const data = response.json()
    console.log(data)
  }

  const handleSubmit = async () => {
    if (disabled) return;
    setDisabled(true)
    if (props.dummy) {
      toast.success("This would have went through if it was a real invoice")
      return
    }
    if (token === 'SOL') {
      const signature = await sendMoney(new PublicKey(props.publicKey), amount, true)
      if (!signature) setDisabled(false)
      sendPaymentToBackend(signature)
    } else {
      // @ts-expect-error
      const mint = tokens[token].mint
      // @ts-expect-error
      const signature = await sendSPL(mint, new PublicKey(props.publicKey), amount, true, undefined, tokens[token].decimals)
      if (!signature) setDisabled(false)
      sendPaymentToBackend(signature)
    }
  }

  return (
    <>
    <div className={invoiceStyles.componentSpaceBetweenFlex}>
      <div className={styles.inputParent} style={{ width: '65%', height: '2.8rem' }}>
        <span>
          <input value={amount.toFixed(4)} disabled={true} type="number" id="amount" className={styles.input} />
        </span>
        <ClickAwayListener onClickAway={() => setExpanded(false)}>
          <div className={styles.tokenSelectionDiv} style={{ height: '2.8rem', display: 'flex' }}>
            <div className={styles.tokenInfoDiv} onClick={() => !props.invoice.token ? setExpanded(!expanded) : null} style={{ cursor: props.invoice.token ? 'not-allowed' : 'pointer' }}>
              {/* @ts-expect-error */}
              <img src={tokens[token].icon.src} alt="" />
              <p>{token}</p>
              <img className={styles.arrowIcon} src={downArrow.src} />
            </div>
            <div
              className={styles.expandedContainer}
              style={{ display: expanded ? 'block' : 'none' }}>
              {Object.keys(tokens).map((mappedToken: string, index: number) => {
                return (
                  <div key={index} onClick={() => handleTokenChange(mappedToken)}>
                    <p style={{ background: mappedToken === token ? 'rgba(55, 123, 255, 0.13)' : '', height: '2.8rem' }} className={styles.tokenSelectorName}>
                      {/* @ts-expect-error */}
                      <span><img src={tokens[mappedToken].icon.src} /></span>
                      {mappedToken}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </ClickAwayListener>
      </div>
      <button onClick={handleSubmit} disabled={disabled} className={invoiceStyles.payBtn}>Pay Now</button>
    </div>

    {!props.dummy && props.invoice.reference && !(props.invoice.status?.includes("paid")) && (
      <div className={iStyles.showQR} onClick={() => setModalIsOpen(true)} style={{ marginTop: '1.5rem', display: 'flex', width: 'max-content'}}>
        <img src={qrIcon.src} alt="" />
      </div>
    )}

    <Modal isOpen={modalIsOpen} style={modalStyles} ariaHideApp={false}>
      <div className={styles.closeParent} style={{ cursor: 'pointer' }}>
        <span className={styles.closeBtn} onClick={() => setModalIsOpen(false)}>
          <img src={cross.src}></img>
        </span>
      </div>
      {qrDataURL && (
        <QRCode url={qrDataURL} />
      )}
    </Modal>

    </>
  )
}