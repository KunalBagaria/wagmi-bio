import { useState } from 'react'
import { useRouter } from 'next/router';
import { RevenueBox, VisitsBox } from '@/layouts/Components'
import { sendMoney } from '@/components/Wallet'
import { PublicKey } from '@solana/web3.js'
import { toasterPromise } from '@/util/toasterNetworkPromise';
import date from 'date-and-time'
import crownIcon from '@/images/icons/crown.svg'
import copyIcon from '@/images/icons/copy-dark.svg'
import radioIcon from '@/images/icons/radio.svg'
import editIcon from '@/images/icons/edit.svg'
import dashStyles from '@/styles/Dashboard.module.scss'
import defaults from '@/styles/Defaults.module.scss'
import styles from '@/styles/Link.module.scss'
import toast from 'react-hot-toast';

export const DashboardLink = ({ link, price }: any) => {
  const [disabled, setDisabled] = useState<boolean>(link.plan !== 1)
  const router = useRouter()

  const copyLink = () => {
    navigator.clipboard.writeText(link.link)
    toast.success('Link copied')
  }

  const handleClick = async () => {
    if (disabled) return
    const wagmiPublicKey = new PublicKey('54o5R8Bxwceb5y9Q1nCb3p8eHyDnWDbCNvxptkbaSCi2')
    const nineDollars = 9 / price
    const signature = await sendMoney(wagmiPublicKey, nineDollars, true)
    if (!signature) return
    setDisabled(true)
    console.log(signature)
    const request = fetch('/api/upgrade/link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        link: link.link,
        paymentSignature: signature
      })
    })
    toast.promise(toasterPromise(request), {
      loading: 'Upgrading your link',
      success: 'Link will be upgraded as soon as the payment is verified, please check back in a few minutes',
      error: 'There was an error upgrading your link, please contact support if your funds went through'
    })
    const response = await request
    const data = response.json()
    console.log(data)
  }

  return (
    <div className={defaults.paddedContainer}>
      <p className={dashStyles.dashboardHeading}>Profile Link</p>
      <p className={dashStyles.dashboardSubHeading}>Dashboard / Links / {link.link}</p>

      <div className={styles.mainContainer}>
        <div className={styles.mainHeader}>
          <div className={defaults.spaceBetweenFlex}>
            <div className={defaults.spaceBetweenFlex} style={{ width: 'max-content'}}>
              <img className={styles.pfp} src={link.profilePicture} alt="" />
              <div style={{ marginLeft: '2rem' }}>
                <p style={{ fontSize: '1.25rem' }} className={dashStyles.dashboardHeading}>{link.name}</p>
                <p style={{ fontSize: '1rem', marginBottom: '0rem', marginTop: '0.5rem' }} className={dashStyles.dashboardSubHeading}>wagmi.bio/{link.link}</p>
              </div>
            </div>
            <div className={styles.headerIcons}>
              <img onClick={copyLink} src={copyIcon.src} alt="" />
              <span onClick={() => router.push(`/dashboard/edit/${link.link}`)}>
                <img src={editIcon.src} alt="" />
                EDIT LINK
              </span>
            </div>
          </div>
        </div>
        <div className={styles.mainBody}>
          <VisitsBox visits={link.visits} />
          <RevenueBox revenue={link.revenue} />
        </div>
      </div>

      <p style={{ marginTop: '3.5rem' }} className={styles.lightHeading}>Your Plan</p>
      <div className={styles.planContainer}>
        <div className={styles.planHeader}>
          <img src={radioIcon.src} alt="" />
          <div>
            <p className={styles.darkText}>{link.plan === 1 ? 'Basic' : 'Professional'}</p>
            <p className={styles.lightText}>{link.plan === 1 ? 'Just the link' : 'Link + All Features'}</p>
          </div>
          <div className={styles.planDivider} />
          <p className={dashStyles.dashboardHeading}>${link.plan === 1 ? 1 : 10}/yr</p>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <p className={styles.mediumText}>{date.format(new Date(link.expires), 'DD MMM, YYYY')}</p>
          <p className={styles.lightText}>Expiry Date</p>
        </div>

        <button className={styles.upgradeButton} onClick={handleClick} disabled={disabled}>
          <span><img src={crownIcon.src} alt="" /></span>
          {link.plan === 1 ? 'UPGRADE PLAN' : 'UPGRADED'}
        </button>
      </div>

    </div>
  )
}