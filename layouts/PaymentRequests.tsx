import styles from '@/styles/Transaction.module.scss'
import dashStyles from '@/styles/Dashboard.module.scss'
import defaults from '@/styles/Defaults.module.scss'
import confirmedIcon from '@/images/icons/confirmed.svg'
import unconfirmedIcon from '@/images/icons/unconfirmed.svg'
import failedIcon from '@/images/icons/failed.svg'
import date from 'date-and-time'
import sol from "@/images/icons/solana.svg"
import usdc from "@/images/icons/usdc.png"
import usdt from "@/images/icons/usdt.png"
import bonk from "@/images/icons/bonk.png"
import explorerIcon from '@/images/icons/explorer.svg'
import { getTokenDetails } from '@/layouts/PaymentModal';
import { getRPC, sendMoney } from '@/components/Wallet';
import { sendSPL } from '@/components/SendSPL';
import { Connection, PublicKey } from '@solana/web3.js'

type Request = {
  _id: string
  from: string,
  link: string,
  status: string,
  token: string,
  amount: number,
  message?: string,
  createdAt: Date
}

const sendPaymentToBackend = (txid: string, _id: string) => {
  const request = fetch('/api/request/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id,
      txid
    })
  })
}

const tokens = [
  { name: 'SOL', icon: sol },
  { name: 'USDC', icon: usdc },
  { name: 'USDT', icon: usdt },
  { name: 'BONK', icon: bonk }
]

export const PaymentRequests = ({
  requests,
  links
}: {
  requests: Request[],
  links: any[]
}) => {
  return (
    <div className={defaults.paddedContainer}>
      <div className={defaults.spaceBetweenFlex}>
        <div>
          <p className={dashStyles.dashboardHeading}>Payment Requests</p>
          <p className={dashStyles.dashboardSubHeading}>Requests created for you</p>
        </div>
      </div>

      <div className={styles.transactionsContainer}>
        <div className={styles.transactionsHeader}>
          <div className={styles.transactionsGrid}>
            <p className={styles.transactionLightText}>Requests</p>
            <p className={styles.transactionLightText}>Message</p>
            <p className={styles.transactionLightText}>Link</p>
            <p className={styles.transactionLightText}>Amount</p>
            <p className={styles.transactionLightText}>Date</p>
            <p className={styles.transactionLightText}>Pay</p>
          </div>
        </div>

        <div className={styles.transactionItems}>
          {requests.map((request: Request, index: number) => {
            const link = links.filter((link: any) => link.link === request.link)[0];
            const handlePayment = async () => {
              const fullToken = request.token === 'SOL' ? 'solana' : request.token.toLowerCase();
              const tDetails = getTokenDetails(fullToken);
              const pMessage = `Payment for: ${request.message} by wagmi.bio/${request.link}`
              let txid = ''
              if (tDetails.mint) {
                let lTxid = await sendSPL(tDetails.mint, new PublicKey(request.from), request.amount, true, pMessage, tDetails.decimals);
                if (!lTxid) return;
                txid = lTxid;
              } else {
                let lTxid = await sendMoney(new PublicKey(request.from), request.amount, true, pMessage);
                if (!lTxid) return;
                txid = lTxid;
              }
              if (!txid) return;
              const connection = new Connection(getRPC(), {
                commitment: 'processed'
              });
              const confirmation = await connection.confirmTransaction(txid);
              if (confirmation.value.err === null) {
                sendPaymentToBackend(txid, request._id);
              };
            }
            return (
              <div className={styles.transactionsGrid} key={index}>
                <div className={defaults.spaceBetweenFlex}>
                  <img src={request.status.includes('sent') ? unconfirmedIcon.src : (request.status.includes('failed') ? failedIcon.src : confirmedIcon.src)} alt="" />
                  <div className={defaults.spaceBetweenFlex} style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingLeft: '2rem',
                    height: '90%',
                  }}>
                    <p className={styles.transactionDarkText}>{
                      `${request.from.substring(0, 4)}....${request.from.substring(40, 44)}`
                    }</p>
                    <p style={{ marginTop: '0.5rem' }} className={styles.transactionLightText}>
                      {request.status === 'sent' ? 'PENDING' : ''}
                      {request.status.includes('unconfirmed') ? 'UNCONFIRMED' : ''}
                      {request.status.includes('failed') ? 'FAILED' : ''}
                      {request.status.includes('paid') ? 'PAID' : ''}
                    </p>
                  </div>
                </div>

                <div className={defaults.spaceBetweenFlex}>
                  <p className={styles.transactionLightText}>
                    {request.message ? request.message : ''}
                  </p>
                </div>

                <div className={defaults.spaceBetweenFlex}>
                  {link && (
                    <>
                      <img className={styles.transactionLinkImage} src={link.profilePicture} alt="" />
                      <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '2rem', height: '90%' }}>
                        <p className={styles.transactionDarkText}>{link.name}</p>
                        <p style={{ marginTop: '0.5rem' }} className={styles.transactionLightText}>wagmi.bio/{request.link}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', height: '90%', justifyContent: 'center' }}>
                  <p className={styles.transactionDarkText} style={{ fontWeight: 700 }}>
                    {request.amount.toFixed(4)} {request.token}
                    <span className={styles.transactionTokenIcon}>
                      <img src={tokens.filter((token: any) => token.name === request.token)[0].icon.src} alt="" />
                    </span>
                  </p>
                </div>

                <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', height: '90%' }}>
                  <p className={styles.transactionLightText}>{date.format(new Date(request.createdAt), 'MMM DD, YYYY')}</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }} className={styles.transactionLightText}>{date.format(new Date(request.createdAt), 'hh:mm A')}</p>
                </div>

                {request.status.includes('paid') && (
                  <a style={{ marginLeft: '1rem', display: 'flex' }} rel="noopener noreferrer" target="_blank" href={`https://solscan.io/tx/${request.status.split(': ')[1]}?cluster=mainnet-beta`}>
                    <img style={{ width: '1.5rem' }} src={explorerIcon.src} alt="" />
                  </a>
                )}

                {!request.status.includes('paid') && (
                  <button
                    style={{
                      height: '100%',
                      marginTop: '0rem'
                    }}
                    className={defaults.newBtn}
                    onClick={handlePayment}
                  >
                    Pay
                  </button>
                )}

              </div>
            )
          })}
        </div>

      </div>


    </div>
  )
}
