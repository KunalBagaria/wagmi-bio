import React, { useState, useEffect } from 'react'
import router, { useRouter } from "next/router"
import styles from "@/styles/Navbar.module.scss"
import Link from "next/link"
import {
  connectWallet,
  connectIfTrusted,
  disconnectWallet
} from "@/components/Wallet"
import getWallet from '@/util/whichWallet'
import defaults from "@/styles/Defaults.module.scss"
import logo from '@/images/dark-logo.svg'
// import { Logo } from "@/layouts/Logo"

const Links = [
  { href: "/#", label: "Overview" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" }
]

export const Navbar = ({ dashboard, setDashPubKey, user, setUser }: { dashboard?: boolean, setDashPubKey?: any, user?: string, setUser?: any }) => {
  const { asPath } = useRouter()
  const [publicKey, setPublicKey] = useState<string>('')
  const wallet = getWallet()

  if (user && !publicKey) {
    setPublicKey(user)
    if (setDashPubKey) setDashPubKey(user)
  };

  useEffect(() => {
    (async () => {
      setTimeout(async () => {
        await connectIfTrusted();
        const stringPubKey = wallet.publicKey.toString()
        setPublicKey(stringPubKey || '')
        if (dashboard) {
          setDashPubKey(stringPubKey)
        }
        if (setUser && stringPubKey) {
          setUser(stringPubKey)
          if (setDashPubKey) setDashPubKey(stringPubKey)
        }
      }, 1000)
    })()
  }, [wallet, dashboard, setDashPubKey, setUser])

  const handleConnect = async () => {
    if (publicKey && wallet.isConnected && !asPath.includes('/dashboard')) {
      router.push('/dashboard')
      return
    } else if (publicKey && wallet.isConnected && asPath.includes('/dashboard')) {
      disconnectWallet()
      setUser('')
      setDashPubKey('')
      setPublicKey('')
      return
    }
    const buffer = await connectWallet()
    if (!buffer) return;

    const pubKey = buffer.toString();
    setPublicKey(pubKey)

    if (dashboard) {
      setDashPubKey(pubKey)
    }
  }

  return (
    <>
      <nav className={styles.container} style={{ background: dashboard ? 'white' : '' }}>
        <div className={styles.navbar} style={{ maxWidth: !dashboard ? '1200px' : '' }}>
          <Link href="/#">
            <a>
              <img src={logo.src} style={{ height: '2.1rem'}} alt="Logo" />
            </a>
          </Link>

          {!dashboard && (
            <div className={styles.links}>
              {Links.map((link, index) => (
                <div className={link.href === asPath ? styles.activeLink : ''} key={index}>
                  <Link href={link.href}>{link.label}</Link>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleConnect} className={styles.connectButton}>{publicKey && dashboard ? (
            <>
              <span className={defaults.navButtonCircle} />
              <span>{`${publicKey.substring(0, 4)}....${publicKey.slice(-4)}`}</span>
            </>
          ) : (publicKey ? 'Dashboard' : 'Connect Wallet')}</button>
        </div>
      </nav>
    </>
  )
}