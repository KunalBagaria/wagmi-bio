/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DefaultHead } from '@/layouts/Head';
import styles from '@/styles/Pay.module.scss';
import logo from '@/images/black-logo.svg';
import arrow from '@/images/icons/arrow-right.svg';
import { Navbar } from '@/layouts/Navbar';
import { handlePaymentPageRequest } from '@/util/handlePaymentPageRequest';
import { NotFound } from '@/layouts/404';
import { PaymentBox } from '@/layouts/PaymentBox';
import getWallet from '@/util/whichWallet';
import { connectIfTrusted } from '@/components/Wallet';
import newLinkIcon from '@/images/icons/new-link.svg';
import one from '@/images/gradients/profile/one.png';
import two from '@/images/gradients/profile/two.png';
import three from '@/images/gradients/profile/three.png';
import four from '@/images/gradients/profile/four.png';
import five from '@/images/gradients/profile/five.png';

type Props = {
  name: string,
  link: string,
  publicKey: string,
  profilePicture: string,
  description: string,
  background: string,
  plan?: number,
  isConfirmed: boolean,
  verified?: boolean,
  price: string,
  error: any
}

const gradients = {
  one, two, three, four, five,
};

export default function Pay(props: Props) {
  const { error } = props;
  const showNotFound = error === 'Reserved Link';
  const notRegistered = error === 'User not found';

  const [user, setUser] = useState<Props>(props);

  const router = useRouter();

  useEffect(() => {
  setUser(props);
  if (router.query.payment) {
    const base64String: any = router.query.payment;
    const rawText = Buffer.from(base64String, 'base64').toString('utf-8');
    console.log(rawText);
  }
  }, [props, router]);

  const [linkOwner, setLinkOwner] = useState<boolean>(false);
  const wallet = getWallet();

  const isOwner = async () => {
  if (wallet) {
    const owner = await connectIfTrusted();
    const isOwner = owner?.publicKey.toString() === props.publicKey;
    setLinkOwner(isOwner);
  }
  };

  const pfpEncodedLink = (notRegistered || showNotFound) ? '' : Buffer.from(props.profilePicture).toString('base64');

  isOwner();

  return (
  <>
    <DefaultHead
    image={notRegistered || showNotFound ? 'https://wagmi.bio/meta.png' : `https://i0.wp.com/wagmi-og.up.railway.app/${props.name}/${props.link}/${pfpEncodedLink}`}
    title={notRegistered || showNotFound ? 'wagmi - making web3 payments easier' : `Pay - ${props.name}`}
    />

    {showNotFound && (
    <>
      <Navbar />
      <NotFound />
    </>
    )}
    {!showNotFound && (
    <>
      { /* @ts-expect-error */}
      <main className={styles.main} style={{ background: `url(${gradients[props.background]?.src ? gradients[props.background].src : gradients['one'].src})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <Link href="/">
        <a className={styles.logo}><img style={{ width: '100%' }} src={logo.src} alt="" /></a>
      </Link>

      {user.plan !== 1 && (
        <PaymentBox user={user} dummy={false} price={Number(props.price)} />
      )}

      {user.plan === 1 && (
        <Link href={linkOwner ? `/dashboard/edit/${props.link}` : '/'} scroll>
        <a className={styles.getLink}>
          <span className={styles.newLinkIcon}><img alt="" src={newLinkIcon.src} /></span>
          {(linkOwner && !props.link.includes('.sol')) ? 'Edit this link' : 'Get your own wagmi.bio'}
          <span><img className={styles.arrow} alt="" src={arrow.src} /></span>
        </a>
        </Link>
      )}

      </main>
    </>
    )}
  </>
  );
}

export const getServerSideProps = async ({ query }: any) => {
  const response = await handlePaymentPageRequest(query);
  return response;
};
