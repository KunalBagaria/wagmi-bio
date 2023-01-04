import styles from '@/styles/Home.module.scss'
import Image from 'next/image'
import { PaymentBox } from './PaymentBox'
import { Pricing, PricingModal } from './Pricing'
import { Features } from './Features'
import gradientOne from "@/images/gradients/landing-1.png"
import gradientTwo from "@/images/gradients/landing-2.png"
import gradientThree from "@/images/gradients/landing-3.png"
import gradientFour from "@/images/gradients/landing-4.png"
import gradientFive from "@/images/gradients/landing-5.png"
import gradientIcon from "@/images/gradients/icon.png"
import puke from "@/images/emojis/puke.png"
import lock from "@/images/icons/lock.svg"
import arrow from "@/images/icons/arrow.svg"
import chartOne from "@/images/icons/chart-1.svg"
import chartTwo from "@/images/icons/chart-2.svg"
import { useState, useEffect } from 'react'
import love from "@/images/emojis/love.png"
import hands from "@/images/emojis/hands.png"
import ok from "@/images/emojis/ok.png"
import toast from 'react-hot-toast'
import kunal from "@/images/avatars/kunal.jpg"
import raj from "@/images/avatars/raj.jpg"
import elon from "@/images/avatars/elon.jpg"
import anatoly from "@/images/avatars/anatoly.jpeg"
import linkurl from "@/images/icons/linkurl.png"
import namebio from "@/images/icons/namebio.png"
import profilepicture from "@/images/icons/profilepicture.png"



const defaultUsers = [
  { name: 'Elon Musk', profilePicture: elon },
  { name: 'Kunal Bagaria', profilePicture: kunal },
  { name: 'Anatoly Yakovenko', profilePicture: anatoly },
  { name: 'Raj Gokal', profilePicture: raj }
]

const returnRandomUser = () => {

  const randNum = Math.floor(Math.random() * 4)
  const randUser = defaultUsers[randNum]
  const firstName = randUser.name.split(' ')[0]

  const BoxProfileUser = {
    name: randUser.name,
    description: `Hello I'm ${firstName} and this is my wagmi link.`,
    profilePicture: randUser.profilePicture,
    publicKey: '',
    link: firstName.toLowerCase(),
  }

  return BoxProfileUser

}



const toastWarning = (message: string) => {
  toast(message, {
  icon: '😃',
  style: {
    border: '0.1rem solid #4575d2',
    padding: '1rem',
    color: '#4575d2',
  }
  })
}

const invalidPattern = (link: string) => {
  if (link && link.includes('.sol')) {
    toastWarning('Name service domains are automatically handled :)')
  } else if (link) {
    toastWarning('Please use alphanumeric characters only for your link')
  } else {
    toastWarning('Please enter a link to register your wallet')
  }
}

export const FirstOveriewSection = ({ price }: { price: string }) => {
  const [link, setLink] = useState<string>('')
  const [defaultUser, setDefaultUser] = useState<ReturnType<typeof returnRandomUser>>()
  const [modal, setModal] = useState<boolean>(false)
  const url = globalThis.location?.host

  useEffect(() => {
    setDefaultUser(returnRandomUser())
  }, [])

  return (
    <>
      <div className={styles.header}>
        <PricingModal isOpen={modal} setModal={setModal} link={link} price={Number(price)} />
        <Image src={love} alt="" />
        <h1 className={styles.heading}>On chain payments done right.</h1>
        <p className={styles.subheading}>Powered by the Solana network, wagmi.bio is your one stop gateway for receiving payments in crypto.</p>
        <form onSubmit={(e) => {
          e.preventDefault()
          setModal(true)
        }}>
          <div className={styles.inputParent}>
            <label htmlFor="urlInput">{url}/</label>
            <input autoComplete="off" maxLength={24} pattern="[a-zA-Z0-9]+" onInvalid={() => invalidPattern(link)} required={true} onChange={(e) => setLink(e.target.value)} id="urlInput" autoFocus={true} placeholder={defaultUser?.link} className={styles.input} />
          </div>
          <button type="submit" className={styles.button}>Get Started</button>
        </form>

      </div>

      <div className={styles.gradientContainer}>
        <img className={styles.bgGradient} src={gradientOne.src} alt="" />
        <img className={styles.arrow} src={arrow.src} alt="" />
        <div className={styles.fixedBox}>
          <div className={styles.pubKeyBox}>
            <img className={styles.pubKeyEmoji} src={puke.src} alt="" />
            <p>8kgbAgt8oe....unHPpkbYGX</p>
          </div>
          {defaultUser && (
            <PaymentBox user={defaultUser} dummy={true} price={Number(price)}>
              <div className={styles.linkBox}>
              <Image src={lock} alt="" />
              <p>wagmi.bio/{defaultUser.link}</p>
              </div>
            </PaymentBox>
          )}
        </div>
      </div>
    </>
  )
}

const transactionsDefault = [
  { link: 'kunal', visits: '13,130', revenue: '$89,090'},
  { link: 'elon', visits: '42,000', revenue: '$69,420'},
  { link: 'tanmay', visits: '15,545', revenue: '$90,105'},
  { link: 'anatoly', visits: '50,300', revenue: '$100,520'},
  { link: 'yash', visits: '10,050', revenue: '$50,900'},
]

export const SecondOveriewSection = () => (
  <>
    <div className={styles.gradientContainer}>
      <img className={styles.bgGradient} src={gradientTwo.src} alt="" />
      <div className={styles.secondOverviewFixedBox}>
        <div className={styles.topDashboardBox}>

        <div className={styles.chartsBox}>
          <img alt="" src={chartTwo.src} />
          <div className={styles.chartInfo}>
            <p className={styles.chartHeading}>Total Visits</p>
            <p className={styles.chartNumbers}>
              12,349
              <span>
              ▲ 34%
              </span>
            </p>
          </div>
        </div>

        <div className={styles.chartsBox}>
          <img alt="" src={chartOne.src} />
          <div className={styles.chartInfo}>
            <p className={styles.chartHeading}>Total Revenue</p>
            <p className={styles.chartNumbers}>
              $99,343
              <span>
              ▲ 114%
              </span>
            </p>
          </div>
        </div>


        </div>

        <div className={styles.transactionsBox}>
        <div style={{ padding: '1.1rem 1.5rem' }}>

          <div className={styles.transactionsGrid}>
            <p className={styles.transactionsTag}>All Links</p>
            <p className={styles.transactionsTag}>Total Views</p>
            <p className={styles.transactionsTag}>Payments</p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {transactionsDefault.map((transaction, index) => (
              <div className={styles.transactionsGrid} key={index}>
                <p>wagmi.bio/{transaction.link}</p>
                <p>{transaction.visits}</p>
                <p>{transaction.revenue}</p>
              </div>
            ))}
          </div>

        </div>
        <div className={styles.divider}></div>
        </div>

      </div>
    </div>
    <div className={styles.header}>
      <Image src={hands} alt="" />
      <h1 className={styles.heading}>A simple dashboard to create, track and analyse your links</h1>
      <p className={styles.subheading}>Keep a track of your links and revenue in a simple unified dashboard</p>
    </div>
  </>
)

export const ThirdOveriewSection = ({ price }: { price: string }) => {

  const [defaultUser, setDefaultUser] = useState<any>(null)

  useEffect(() => {
    setDefaultUser(returnRandomUser())
  }, [])

  return (
    <>
    <div className={styles.header}>
      <Image src={ok} alt="" />
      <h1 className={styles.heading}>Customize and remix every part of your link page</h1>
      <p className={styles.subheading}>Make wagmi.bio your own by customizing the profile picture, name or background of your link</p>
    </div>
    <div className={styles.gradientContainer}>
      <img className={styles.bgGradient} src={gradientThree.src} alt="" />
      <div className={styles.customizeIcons}>
        <img className={styles.linkUrlIcon} src={linkurl.src} alt="" />
        <img className={styles.nameBioIcon} src={namebio.src} alt="" />
        <img className={styles.profilePictureIcon} src={profilepicture.src} alt="" />
      </div>
      <div className={styles.fixedBox}>
      <div className={styles.pubKeyBox}>
        <img className={styles.gradientIcon} src={gradientIcon.src} alt="" />
        <p className={styles.customizeText}>BACKGROUND COLOR</p>
      </div>
      {defaultUser && (
        <PaymentBox user={defaultUser} dummy={true} price={Number(price)}>
        <div className={styles.linkBox}>
          <Image src={lock} alt="" />
          <p>wagmi.bio/{defaultUser.link}</p>
        </div>
        </PaymentBox>
      )}
      </div>
    </div>
    </>
  )
}

export const FeaturesSection = () => (
  <section className={styles.featureParent}>
    <div className={styles.gradientContainer}>
      <img className={styles.featureGradient} src={gradientFour.src} alt="" />
      <div className={styles.featuresAbsolute}>
      <Features />
      </div>
    </div>
  </section>
)

export const PricingSection = () => (
  <>
    <div className={styles.gradientContainer}>
      <img className={styles.bgGradient} src={gradientFive.src} alt="" />
      <div className={styles.fixedBox}>
        <Pricing dummy={true} />
      </div>
    </div>
    <div className={styles.header}>
      <Image src={hands} alt="" />
      <h1 className={styles.heading}>No BS Pricing. Pay as you go and cancel anytime</h1>
      <p className={styles.subheading}>{"We don't charge any transactions fees and keep the service running through a simple subscription model"}</p>
    </div>
  </>
)

export const GetStartedSection = ({ price }: { price: number }) => {
  const [link, setLink] = useState<string>('')
  const [modal, setModal] = useState<boolean>(false)
  const user = returnRandomUser()
  const url = globalThis.location?.host

  return (
    <div className={styles.getStartedSection}>
      <PricingModal isOpen={modal} setModal={setModal} link={link} price={Number(price)} />
      <div className={styles.getStartedChild}>
        <h1 className={styles.tagline}>Start getting paid in crypto</h1>
        <form onSubmit={(e) => {
          e.preventDefault()
          setModal(true)
        }}>
          <div className={styles.getStartedInputParent}>
            <label htmlFor="getStartedInput">{url}/</label>
            <input pattern="[a-zA-Z0-9]+" onInvalid={() => invalidPattern(link)} required={true} onChange={(e) => setLink(e.target.value)} id="getStartedInput" placeholder={user.link} className={styles.getStartedInput} />
          </div>
          <button type="submit" className={styles.getStartedButton}>Get Started</button>
        </form>
      </div>
    </div>
  )
}