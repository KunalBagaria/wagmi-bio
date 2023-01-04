/* eslint-disable @next/next/no-img-element */
import { PublicKey } from '@solana/web3.js'
import ClickAwayListener from 'react-click-away-listener';
import { useRouter } from 'next/router'
import { incrementRevenue } from '@/components/UpdateRevenue'
import styles from "@/styles/Pay.module.scss"
import homeStyles from "@/styles/Home.module.scss"
import { useState, useEffect } from "react"
import { sendMoney } from "@/components/Wallet"
import sol from "@/images/icons/sol.png"
import usdc from "@/images/icons/usdc.png"
import usdt from "@/images/icons/usdt.png"
import bonk from "@/images/icons/bonk.png"
import downArrow from "@/images/icons/down-arrow.svg"
import { getTokenPrice } from '@/util/getTokenPrice'
import verified from "@/images/icons/verified.svg"
import notFound from "@/images/avatars/404.svg"
import { sendSPL } from '@/components/SendSPL'
import { connectWallet } from "@/components/Wallet"
import { PricingModal } from '@/layouts/Pricing'
import getWallet from '@/util/whichWallet'
import linkIcon from '@/images/icons/link.svg'
import toast from "react-hot-toast"

export type Props = {
  user: {
    name: string,
    link: string,
    description: string,
    profilePicture: any,
    publicKey: string,
    isConfirmed?: boolean,
    error?: string,
    socials?: [{ name: string, link: string }]
    verified?: boolean
  },
  price: number
  dummy: boolean
  children?: any
}


const dummyFormSubmission = async (e: any) => {
  e.preventDefault()
  await connectWallet()
  toast.success("This would have went through if it was a real transaction")
}

const UserNotFound = (props: Props) => {
  const [modal, setModal] = useState<boolean>(false)
  const { asPath } = useRouter()
  const link = asPath.split('/')[1]

  return (
    <>
      <PricingModal isOpen={modal} setModal={setModal} link={link} price={props.price} />
      <div className={styles.paymentBox}>
        <div>
          <div className={styles.profile}>
            <img src={notFound.src} alt="" />
            <div>
              <p className={styles.name}>Uh-oh! 404</p>
              <p className={styles.description}>This link doesn’t exist yet. Feel free to register</p>
            </div>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault()
            setModal(true)
          }}>
            <div className={homeStyles.inputParent}>
              <label htmlFor="urlInput">wagmi.bio/</label>
              <input value={link} className={homeStyles.input} disabled={true} />
            </div>
            <button type="submit" className={homeStyles.button}>Buy Now</button>
          </form>
        </div>
      </div>
    </>
  )
}


export const PaymentBox = (props: Props) => {

  const [amount, setAmount] = useState<number>(0)
  const [token, setToken] = useState<string>('SOL')
  const [clientPrice, setClientPrice] = useState<number>(0)
  const [expanded, setExpanded] = useState<boolean>(false)
  const [socials, setSocials] = useState(props.user.socials)

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

  const handleTokenChange = async (token: string) => {
    setExpanded(false)
    // @ts-expect-error
    if (tokens[token].price) {
      setToken(token)
    // @ts-expect-error
    } else if (tokens[token].getPrice) {
      setToken(token)
      // @ts-expect-error
      const fPrice = await tokens[token].getPrice()
      setClientPrice(fPrice)
    }
  }

  const pay = async (e: any) => {
    e.preventDefault()
    const pubKey = new PublicKey(props.user.publicKey)

    let incrementData = {
      token,
      amount,
      amountInUSD: 0,
      createdAt: new Date(),
      link: props.user.link,
      signature: '',
      from: ''
    }

    if (token === 'SOL') {
      const signature = await sendMoney(pubKey, amount)
      if (!signature) return
      incrementData = { ...incrementData, signature, amountInUSD: amount * props.price }
    } else {
      // @ts-expect-error
      const splToken: any = tokens[token]
      const signature = await sendSPL(splToken.mint, pubKey, amount, undefined, undefined, splToken.decimals);
      if (!signature) return
      incrementData = { ...incrementData, signature }
      if (splToken.price) {
        incrementData = { ...incrementData, amountInUSD: amount * splToken.price }
      } else {
        const gotPrice = await splToken.getPrice()
        incrementData = { ...incrementData, amountInUSD: amount * gotPrice }
      }
    }
    const fromWallet = getWallet()
    const fromPublicKey = fromWallet.publicKey.toString()
    incrementData = { ...incrementData, from: fromPublicKey }
    console.log(incrementData)
    incrementRevenue(incrementData)
  }

  const reload = () => window.location.reload()

  useEffect(() => {
    if (props.user.isConfirmed === false && !props.dummy) {
      setTimeout(reload, 6000)
    }
  }, [props])

  const profilePicture = props.user.profilePicture
  const confirmed = props.user.isConfirmed !== false || props.dummy
  const error = props.user.error

  if (error && (error === 'User not found' || error === 'Reserved Link')) {
    return <UserNotFound {...props} />
  } else {
    return (
      <>
        <div className={styles.paymentBox} style={{ marginTop: props.dummy ? '2rem' : ''}}>
          <div>

            {props.children}

            {!confirmed && (
              <p className={styles.description}>This link has been reserved and will be available as soon as the payment is verified.</p>
            )}

            {confirmed && (
              <>
                <div className={styles.profile}>
                  <img className={styles.pfp} src={profilePicture.src ? profilePicture.src : profilePicture} alt="" />
                  <div className={styles.nameAndDescp}>
                    <p className={styles.name}>
                      {props.user.name}
                      {props.user.verified && <span className={styles.verifiedIcon}><img src={verified.src} /></span>}
                    </p>
                    <p className={styles.description}>
                      {props.user.description ? props.user.description : `Hi, I'm ${props.user.name ? props.user.name : 'a wagmi user'} and this is my wagmi link.`}
                    </p>
                  </div>
                </div>
                <div className={styles.socialLinks}>
                  {socials && socials.length > 0 && (
                    <>
                      {socials.map((social: any, i: number) => (
                        <div key={i}>
                          {social.name && social.link && (
                            <a className={styles.socialIconLink} href={social.link} target="_blank" rel="noopener noreferrer">{social.name}</a>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}


            <form onSubmit={(e) => props.dummy ? dummyFormSubmission(e) : pay(e)}>
              <div className={styles.inputParent}>

                <span>
                  <input max={9999999} onChange={(e) => {
                    setAmount(Number(e.target.value))
                  }} disabled={!confirmed} type="number" min={0.00001} maxLength={10} step={0.000001} id="amount" placeholder="Amount" className={styles.input} required={!props.dummy} />
                </span>

                <ClickAwayListener onClickAway={() => setExpanded(false)}>
                <div className={styles.tokenSelectionDiv}>
                  <div className={styles.tokenInfoDiv} onClick={() => setExpanded(!expanded)}>
                    {/* @ts-expect-error */}
                    <img src={tokens[token].icon.src} alt="" />
                    <p>{token}</p>
                    <img className={styles.arrowIcon} src={downArrow.src} style={{ transform: expanded ? 'rotate(180deg)': 'rotate(0deg)' }} />
                  </div>
                  <div
                    className={styles.expandedContainer}
                    style={{ display: expanded ? 'block' : 'none' }}>
                    {Object.keys(tokens).map((mappedToken: string, index: number) => {
                      return (
                        <div key={index} onClick={() => handleTokenChange(mappedToken)}>
                          <p style={{ background: mappedToken === token ? 'rgba(55, 123, 255, 0.13)' : '' }} className={styles.tokenSelectorName}>
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
                {props.price > 0 && (
                  <p className={styles.conversion} style={{ justifyContent: 'space-between' }}>
                    {/* @ts-expect-error */}
                    {!tokens[token].price && (
                      <>
                        <span>{amount ? (amount * clientPrice).toLocaleString(undefined, { 'minimumFractionDigits': 2,'maximumFractionDigits': 2 }) : 0} USD</span>
                        {`1 ${token} = ~$${clientPrice}`}
                      </>
                    )}
                    {/* @ts-expect-error */}
                    {tokens[token].price && (
                      <>
                        {/* @ts-expect-error */}
                        <span>{amount ? (amount * tokens[token].price).toLocaleString(undefined, { 'minimumFractionDigits': 2,'maximumFractionDigits': 2 }) : 0} USD</span>
                        {/* @ts-expect-error */}
                        {`1 ${token} = ~$${tokens[token].price}`}
                      </>
                    )}
                  </p>
                )}
              <button type="submit" disabled={!confirmed} className={props.dummy ? styles.dummyPayButton : styles.payButton}>Pay Now</button>
            </form>
          </div>
        </div>
      </>
    )
  }
}