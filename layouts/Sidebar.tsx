import { useState } from 'react';
import { useRouter } from 'next/router'
import ClickAwayListener from 'react-click-away-listener'
import plus from '@/images/icons/plus.svg'
import downArrow from '@/images/icons/white-down-arrow.svg'
import profileIcon from '@/images/icons/profile.svg'
import styles from '@/styles/Dashboard.module.scss'
import defaults from '@/styles/Defaults.module.scss'
import invoiceIcon from '@/images/icons/invoice.svg'
import { SvgLink } from '@/dynamic/Link'
import { SvgInvoice } from '@/dynamic/Invoice'
import { SvgEmbed } from '@/dynamic/Embed'
import { SvgSettings } from '@/dynamic/Settings'
import { SvgTransactions } from '@/dynamic/Transactions'
import { SvgRequests } from '@/dynamic/Requests'

export const Sidebar = () => {
  const links = [
    { href: '/dashboard', subSection: '/dashboard/link', icon: SvgLink, text: 'All Links' },
    { href: '/dashboard/transactions', subSection: 'none', icon: SvgTransactions, text: 'Transactions' },
    { href: '/dashboard/embed', subSection: 'none', icon: SvgEmbed, text: 'Embed Code' },
    { href: '/dashboard/invoice', subSection: '/dashboard/invoice/new', icon: SvgInvoice, text: 'Invoices' },
    { href: '/dashboard/webhooks', subSection: 'none', icon: SvgSettings, text: 'Webhooks' },
    { href: '/dashboard/requests', subSection: 'none', icon: SvgRequests, text: 'Requests' },
  ]
  const { asPath } = useRouter()
  const router = useRouter()

  const [expanded, setExpanded] = useState(false)

  return (
    <div className={styles.container}>

      <ClickAwayListener onClickAway={() => setExpanded(false)}>
        <div className={styles.createBtnParent}>
          <div className={styles.createButton} onClick={() => setExpanded(!expanded)}>
            <span className={styles.plusIcon}><img alt="" src={plus.src} /></span>
            <span>{'Create New'}</span>
            <div className={styles.createBtnArrow}>
              <img src={downArrow.src} />
            </div>
          </div>

          <div style={{ display: expanded ? 'flex' : 'none', top: '10rem' }} className={defaults.absoluteExpandedContainer}>
            <div onClick={() => router.push('/')}>
              <img src={profileIcon.src} />
              <p>Profile Link</p>
            </div>
            <div onClick={() => router.push('/dashboard/invoice/new')}>
              <img src={invoiceIcon.src} />
              <p>Invoice</p>
            </div>
          </div>
        </div>
      </ClickAwayListener>

      {links.map((link, index) => (
        <div key={index} className={asPath === link.href || asPath.includes(link.subSection) || (asPath.includes('/dashboard/edit') && index === 0) ? styles.activeSideBtn : styles.inActiveSideBtn}>
          <button onClick={() => router.push(link.href)} className={styles.sidebarButton}>
            <link.icon />
            <span>{link.text}</span>
          </button>
        </div>
      ))}

    </div>
  )
}