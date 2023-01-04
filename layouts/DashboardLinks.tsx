import { useState, useEffect } from 'react';
import { VisitsBox, RevenueBox, TotalLinks, TotalInvoices } from '@/layouts/Components'
import { Loading } from '@/layouts/Loading'
import { LinkBox } from '@/layouts/LinkBox';
import styles from '@/styles/Dashboard.module.scss'

export const DashboardLinks = ({ pubKey }: { pubKey: string } ) => {

  const [links, setLinks] = useState<Array<any>>([])
  const [invoiceCount, setInvoiceCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchLinks = () => {
      if (pubKey) {
        fetch(`/api/get/links/${pubKey}`)
          .then(res => res.json())
          .then(res => {
            setLinks(res)
            setLoading(false)
          })
          .catch((err) => console.log(err))
        fetch(`/api/get/invoices/${pubKey}`)
          .then(res => res.json())
          .then(res => setInvoiceCount(res.length))
          .catch((err) => console.log(err))
      }
    }
    fetchLinks()
  }, [pubKey])

  const totalVisits = links.map((link) => link.visits ? link.visits : 0).reduce((a, b) => a + b, 0)
  const totalRevenue = links.map((link) => link.revenue ? link.revenue : 0).reduce((a, b) => a + b, 0)

  return (
    <>
      <div className={styles.linksContainer}>
        <div className={styles.stats}>
          <VisitsBox visits={totalVisits} />
          <RevenueBox revenue={totalRevenue} />
          <TotalInvoices invoices={invoiceCount} />
          <TotalLinks links={links.length} />
        </div>

        <div className={styles.dashboardHeadingGap}>
          <p className={styles.dashboardHeading}>Active Links</p>
        </div>


        {!pubKey && (
          <p className={styles.dashInfo}>Please connect your wallet</p>
        )}

        {!links[0] && !loading && (
          <p className={styles.dashInfo}>Sorry, no links found for this account</p>
        )}

        {loading && pubKey && (
          <>
            <p className={styles.dashInfo}>Loading your links...</p>
            <Loading size={100} />
          </>
        )}

        <div className={styles.linksGrid}>
          {pubKey && links[0] && links.map((box, index) => (
            <LinkBox key={index} link={box} />
          ))}
        </div>


      </div>
    </>
  )
}