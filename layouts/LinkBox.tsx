import styles from '@/styles/Dashboard.module.scss'
import viewIcon from '@/images/icons/views.svg'
import dollarIcon from '@/images/icons/dollar.svg'
import copyIcon from '@/images/icons/copy.svg'
import editIcon from '@/images/icons/edit-blue.svg'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

export const LinkBox = (box: any, index: number) => {
  const visits = box.link.visits
  const revenue = box.link.revenue
  const router = useRouter()

  const handleCopy = (e: any) => {
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.host}/${box.link.link}`)
    toast.success('Link copied to clipboard')
  }

  return (
    <div onClick={() => router.push(`/dashboard/link/${box.link.link}`)} className={styles.linkBox} key={index}>
      <div className={styles.linkHeader}>
        <img src={box.link.profilePicture} />
        <div className={styles.boxLinkProfile}>
          <p className={styles.boxNameTag}>{box.link.name}</p>
          <p className={styles.boxLightText}>{window.location.host}/{box.link.link}</p>
        </div>
      </div>
      <div className={styles.boxFooter}>
        <div className={styles.boxFooterSection}>
          <div className={styles.boxLinkStats}>
            <span><img src={viewIcon.src} /></span>
            <span className={styles.boxVisits}>{visits > 0 ? visits.toLocaleString(undefined, { 'minimumFractionDigits': 0,'maximumFractionDigits': 0 }) : 0}</span>
          </div>
          <div className={styles.boxLinkStats}>
            <span><img src={dollarIcon.src} /></span>
            <p>{revenue > 0 ? revenue.toLocaleString(undefined, { 'minimumFractionDigits': 2,'maximumFractionDigits': 2 }) : '0.00'}</p>
          </div>
        </div>
        <div className={styles.boxFooterSection}>
          <img onClick={handleCopy} className={styles.boxCopy} src={copyIcon.src} />
          <div
            className={styles.boxLinkStats}
            style={{ color: '#2359C0', cursor: 'pointer', marginRight: '0rem' }}
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/dashboard/edit/${box.link.link}`)
            }}>
            <span style={{ marginRight: '0.25rem' }}><img src={editIcon.src} /></span>
            EDIT
          </div>
        </div>
      </div>
    </div>
  )
}