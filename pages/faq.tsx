/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react'
import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import { HeroContainer } from '@/layouts/HeroContainer';
// @ts-expect-error
import Faq from 'react-faq-component';
import styles from '@/styles/Home.module.scss';
import defaults from '@/styles/Defaults.module.scss';

const faqStyles = {
  rowTitleColor: "#25353D",
  rowContentColor: '#8c9498',
  rowContentPaddingTop: '1rem',
  rowContentPaddingBottom: '1.8rem',
};

const faqConfig = {
  tabFocus: true
}

const anchor = (link: string, label: string) => `<a class="faq-link" rel="noopener noreferrer" target="_blank" style="color: #25353D" href="${link}">${label}</a>`
const dark = (text: string) => `<span style="color: #25353D; font-weight: bold;">${text}</span>`

const data = {
  rows: [
    {
      title: "I'm new to Solana / Crypto. How do I get started?",
      content: `Start by installing a Solana wallet in your browser. We recommend ${anchor('https://phantom.app/', 'Phantom Wallet')}. To add initial money to your wallet, you can use this ${anchor('https://bip.so/@superteamdao/How-to-get-SOLs-in-Phantom-yTqPw', 'guide')}.`,
    },
    {
      title: "How does it work?",
      content: "When you purchase a wagmi link, we store your wallet address carefully and use that in your payment link."
    },
    {
      title: "What do I get with the professional plan?",
      content: `Invoicing, advanced transaction statistics, and embedded integrations.`
    },
    {
      title: "Do I have complete ownership of my funds?",
      content: "Yes. We only store your wallet address and use it to send you payments. We do not store your funds."
    },
    {
      title: "How do I get paid?",
      content: "You get paid instantly with the fastest cryptocurrency in the world, directly to your wallet."
    },
    {
      title: "Is there a fee to use wagmi.bio?",
      content: `We charge ${dark('0%')} commission fees unlike other services. Instead we keep the service running with a very cheap one time fee.`
    },
    {
      title: "How is this different from other platforms?",
      content: `With the power of the ${anchor('https://solana.com', 'Solana')} network, wagmi.bio powers ${dark('the fastest way')} to accept payments internationally from anyone. We've built in Invoicing feature in the professional plan for all the freelancers who want to accept payments through crypto.`
    },
    {
      title: "How do I contact wagmi.bio?",
      content: `You can contact us at our ${anchor('https://discord.gg/8Gkh4fjwgh', 'Discord server')} or reach us directly at our ${anchor('mailto://help@wagmi.bio', 'email')}.`
    }
  ]
}

export default function FaqPage({ user, setUser }: { user?: string, setUser?: any}) {
  return (
    <>
      <DefaultHead title="FAQ - wagmi.bio" />
      <Navbar user={user} setUser={setUser} />
      <HeroContainer title={'FAQ'} />
      <div id="#" className={defaults.staticHeroContent}>
        <div style={{ maxWidth: '800px', padding: '0rem 3rem'}}>
          <Faq config={faqConfig} styles={faqStyles} data={data} />
        </div>
      </div>
    </>
  );
}