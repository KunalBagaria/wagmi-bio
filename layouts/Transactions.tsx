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
import bonk from "@/images/icons/bonk.png";
import solr from "@/images/icons/solr.png";
import explorerIcon from '@/images/icons/explorer.svg'

type Transaction = {
  signature: string,
  from: string,
  to: string,
  link: string,
  status: string,
  message?: string,
  token: string,
  amount: number,
  amountInUSD: number,
  createdAt: Date
}

const tokens = [
  { name: 'SOL', icon: sol },
  { name: 'USDC', icon: usdc },
  { name: 'USDT', icon: usdt },
  { name: 'SOLR', icon: solr },
  { name: 'BONK', icon: bonk },
]

export const Transactions = ({ transactions, links }: { transactions: Transaction[], links: any[] }) => {
  console.log(transactions);
  return (
    <div className={defaults.paddedContainer}>
      <div className={defaults.spaceBetweenFlex}>
        <div>
          <p className={dashStyles.dashboardHeading}>Transactions</p>
          <p className={dashStyles.dashboardSubHeading}>View all your transactions</p>
        </div>
      </div>

      <div className={styles.transactionsContainer}>
        <div className={styles.transactionsHeader}>
          <div className={styles.transactionsGrid}>
            <p className={styles.transactionLightText}>Transactions</p>
            <p className={styles.transactionLightText}>Message</p>
            <p className={styles.transactionLightText}>Link</p>
            <p className={styles.transactionLightText}>Amount</p>
            <p className={styles.transactionLightText}>Date</p>
            <p className={styles.transactionLightText}>Explorer</p>
          </div>
        </div>

        <div className={styles.transactionItems}>
          {transactions.map((transaction: Transaction, index: number) => {
            const link = links.filter((link: any) => link.link === transaction.link)[0];
            return (
              <div className={styles.transactionsGrid} key={index}>
                <div className={defaults.spaceBetweenFlex}>
                  <img src={transaction.status.includes('unconfirmed') ? unconfirmedIcon.src : (transaction.status.includes('failed') ? failedIcon.src : confirmedIcon.src)} alt="" />
                  <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '2rem', height: '90%' }}>
                    <p className={styles.transactionDarkText}>{
                      transaction.from.includes('Solana') ? transaction.from :
                      `${transaction.from.substring(0, 4)}....${transaction.from.substring(40, 44)}`
                    }</p>
                    <p style={{ marginTop: '0.5rem' }} className={styles.transactionLightText}>{transaction.status.toUpperCase()}</p>
                  </div>
                </div>

                <div className={defaults.spaceBetweenFlex}>
                  <p className={styles.transactionLightText}>
                    {transaction.message ? transaction.message : ''}
                  </p>
                </div>
                {link && (
                  <div className={defaults.spaceBetweenFlex}>
                    <img className={styles.transactionLinkImage} src={link.profilePicture} alt="" />
                    <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '2rem', height: '90%' }}>
                      <p className={styles.transactionDarkText}>{link.name}</p>
                      <p style={{ marginTop: '0.5rem' }} className={styles.transactionLightText}>wagmi.bio/{transaction.link}</p>
                    </div>
                  </div>
                )}
                <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', height: '90%' }}>
                  <p className={styles.transactionDarkText} style={{ fontWeight: 700 }}>
                    {transaction.amount.toFixed(4)} {transaction.token}
                    <span className={styles.transactionTokenIcon}>
                      <img src={tokens.filter((token: any) => token.name === transaction.token)[0].icon.src} alt="" />
                    </span>
                  </p>
                  {transaction.amountInUSD && (
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }} className={styles.transactionLightText}>${transaction.amountInUSD.toLocaleString(undefined, { 'minimumFractionDigits': 2,'maximumFractionDigits': 2 })} USD</p>
                  )}
                </div>

                <div className={defaults.spaceBetweenFlex} style={{ flexDirection: 'column', alignItems: 'flex-start', height: '90%' }}>
                  <p className={styles.transactionLightText}>{date.format(new Date(transaction.createdAt), 'MMM DD, YYYY')}</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }} className={styles.transactionLightText}>{date.format(new Date(transaction.createdAt), 'hh:mm A')}</p>
                </div>

                <a style={{ marginLeft: '1rem', display: 'flex' }} rel="noopener noreferrer" target="_blank" href={`https://solscan.io/tx/${transaction.signature}?cluster=mainnet-beta`}>
                  <img style={{ width: '1.5rem' }} src={explorerIcon.src} alt="" />
                </a>

              </div>
            )
          })}
        </div>

      </div>


    </div>
  )
}
