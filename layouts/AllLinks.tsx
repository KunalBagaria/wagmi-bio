import { useState, useEffect } from 'react';
import edit from '@/images/icons/edit.svg';
import date from 'date-and-time';
import { VisitsBox, RevenueBox, TotalLinks } from '@/layouts/Components'
import { Loading } from '@/layouts/Loading'
import styles from '@/styles/Dashboard.module.scss'
import { useRouter } from 'next/router';

const labels = ["All Links", "Total Views", "Payments", "Renewal", "Fees", "Edit"]

export const AllLinks = ({ pubKey }: { pubKey: string } ) => {

  const [links, setLinks] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter();

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
          <TotalLinks links={links.length} />
        </div>
        <div className={styles.linkDetails}>
          <div className={styles.dashboardGrid}>
            {labels.map((label, index) => (
              <p className={styles.dashboardTagLabel} key={index}>{label}</p>
            ))}
          </div>
        </div>
        {pubKey && links[0] && links.map((link, index) => (
          <div className={styles.dashboardGrid} key={index}>
            <p className={styles.dashboardTagValue}>wagmi.bio/{link.link}</p>
            <p className={styles.dashboardTagValue}>{link.visits ? link.visits.toLocaleString(undefined, { 'minimumFractionDigits': 0,'maximumFractionDigits': 0 }) : 0}</p>
            <p className={styles.dashboardTagValue}>${(link.revenue ? link.revenue : 0).toLocaleString(undefined, { 'minimumFractionDigits': 2,'maximumFractionDigits': 2 })}</p>
            <p className={styles.dashboardTagValue}>{
              date.format(new Date(link.expires), 'DD-MM-YYYY')
            }</p>
            <p className={styles.dashboardTagValue}>${link.plan === 1 ? 1 : 10}/year</p>
            <span onClick={() => router.push(`/dashboard/edit/${link.link}`)} className={styles.editIcon}><img src={edit.src} alt="edit" /></span>
          </div>
        ))}
        {!pubKey && (
          <>
            <p className={styles.dashInfo}>Please connect your wallet</p>
          </>
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
      </div>
    </>
  )
}