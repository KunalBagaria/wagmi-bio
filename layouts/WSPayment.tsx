// Style Import
import styles from '@/styles/WSPayment.module.scss';

// Logo Import
import { Logo } from '@/dynamic/Logo';

// Icons Import
import spayIcon from '@/images/icons/spay.svg';
import * as icons from '@/dynamic/socials/Exports';
import successIcon from '@/images/icons/toast/tick.svg';
import processingIcon from '@/images/icons/toast/processing.svg';
import errorIcon from '@/images/icons/toast/error.svg';

// Layout Imports
import { DefaultHead } from '@/layouts/Head';
import { PricingModal } from '@/layouts/Pricing';

import { Connection } from '@solana/web3.js';
import { getRPC } from '@/components/Wallet';

// Gradients
import one from '@/images/gradients/profile/one.png';
import two from '@/images/gradients/profile/two.png';
import three from '@/images/gradients/profile/three.png';
import four from '@/images/gradients/profile/four.png';
import five from '@/images/gradients/profile/five.png';

// Images
import unavailableImage from '@/images/unavailable-link.svg';
import handImage from '@/images/hand.png';
import burgerImage from '@/images/burger.png';
import Image from 'next/image'

import Link from 'next/link';
import { PaymentButton, RequestButton } from './Components';
import { useState, useEffect } from 'react';
import { getTokenDetails, PaymentModal, RequestPaymentModal, SolanaPayModal } from './PaymentModal';
import { useRouter } from 'next/router';

// Social Interface
export interface Social {
  name: string,
  link: string,
}

// Props Interface
export interface Props {
  name: string,
  link: string,
  publicKey: string,
  profilePicture: string,
  description: string,
  background: string,
  isConfirmed: boolean,
  verified?: boolean,
  socials?: Social[],
  price: string,
  error: any
}

interface GradientsInterface {
  [key: string]: string
}

const Gradients: GradientsInterface = {
  'one': one.src,
  'two': two.src,
  'three': three.src,
  'four': four.src,
  'five': five.src
}

interface StringObject {
  [key: string]: string
}

const statusColors: StringObject = {
  'processing': '#A7A7A7',
  'error': '#F44766',
  'success': '#64DFC1',
}

const statusIcons: StringObject = {
  'processing': processingIcon.src,
  'error': errorIcon.src,
  'success': successIcon.src,
}

const statusText: StringObject = {
  'processing': 'Processing Transaction. Waiting for confirmation',
  'error': 'Transaction Failed',
  'success': 'Hooray! Transaction Successful',
}

export const PaymentToast = ({
  txid
}: {
  txid: string
}) => {
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    (async function() {
      const connection = new Connection(getRPC());
      const confirmation = await connection.confirmTransaction(txid, 'processed');
      if (confirmation.value.err === null) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    })();
  }, []);

  return (
    <div
      style={{
        background: statusColors[status],
      }}
      className={styles.toast}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img src={statusIcons[status]} alt="" />
        <p
          className={styles.whiteText}
          style={{ marginLeft: '1rem' }}
        >
          {statusText[status]}
        </p>
      </div>
      <a
        href={`https://solscan.io/tx/${txid}?cluster=mainnet-beta`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontWeight: 700,
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
        className={`${styles.whiteText} ${styles.txLink}`}
      >VIEW TXN</a>
    </div>
  )
}

export const MainScreen = ({
  props,
  editLink
}: {
  props: Props,
  editLink?: boolean
}) => {
  const { error } = props;
  const notRegistered = error === 'User not found';
  const showNotFound = error === 'Reserved Link';
  const pfpEncodedLink = (notRegistered || showNotFound) ? '' : Buffer.from(props.profilePicture).toString('base64');
  const [paymentModalIsOpen, setPaymentModalIsOpen] = useState(false);
  const [sPayModalIsOpen, setSPayModalIsOpen] = useState(false);
  const [rPayModalIsOpen, setRPayModalIsOpen] = useState(false);
  const [txid, setTxid] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    if (txid) {
      setPaymentModalIsOpen(false);
      setSPayModalIsOpen(false);
      console.log('🎉 Found Transaction ID:', txid);
    }
  }, [txid])

  return (
    <>
      <div
        style={{
          filter: (paymentModalIsOpen || sPayModalIsOpen || rPayModalIsOpen) ? 'blur(0.25rem)' : 'none',
          // @ts-expect-error
          flexDirection: editLink ? 'column' : '',
        }}
        className={styles.main}
      >
        <DefaultHead
          image={notRegistered || showNotFound ? 'https://wagmi.bio/meta.png' : `https://i0.wp.com/wagmi-og.up.railway.app/${props.name}/${props.link}/${pfpEncodedLink}`}
          title={notRegistered || showNotFound ? 'wagmi - making web3 payments easier' : `Pay - ${props.name}`}
        />
        <LeftPane
          editLink={editLink}
          overrideBackgroundColor={notRegistered
            ? '#00D18C' : (
              showNotFound ? '#F6F7F9' : ''
            )}
          overrideLogoColor={showNotFound ? '#8C8C8C' : undefined}
          notRegistered={notRegistered}
          overrideBackgroundImage={props.background ? Gradients[props.background] : undefined}
        />
        {props.isConfirmed && !notRegistered && !showNotFound && (
          <RightPane
            props={props}
            setPaymentModalIsOpen={setPaymentModalIsOpen}
            setSPayModalIsOpen={setSPayModalIsOpen}
            setRPayModalIsOpen={setRPayModalIsOpen}
            setToken={setToken}
            editLink={editLink}
          />
        )}
        {txid && (
          <PaymentToast txid={txid} />
        )}
        {(!props.isConfirmed || showNotFound || notRegistered) && (
          <UnavailableLink
            price={props.price}
            notRegistered={notRegistered}
            reserved={showNotFound}
          />
        )}
      </div>
      {props.isConfirmed && !showNotFound && (
        <>
          <PaymentModal
            props={props}
            token={token}
            setToken={setToken}
            isOpen={paymentModalIsOpen}
            setIsOpen={setPaymentModalIsOpen}
            setTxid={setTxid}
          />
          <SolanaPayModal
            props={props}
            token={token || 'solana'}
            setToken={setToken}
            isOpen={sPayModalIsOpen}
            setIsOpen={setSPayModalIsOpen}
            setTxid={setTxid}
          />
          <RequestPaymentModal
            props={props}
            token={token || 'solana'}
            setToken={setToken}
            isOpen={rPayModalIsOpen}
            setIsOpen={setRPayModalIsOpen}
          />
        </>
      )}
    </>
  )
};


export const LeftPane = ({
  overrideBackgroundImage,
  overrideBackgroundColor,
  overrideLogoColor,
  notRegistered,
  editLink
}: {
  overrideBackgroundImage?: string,
  overrideBackgroundColor?: string,
  overrideLogoColor?: string,
  notRegistered?: boolean,
  editLink?: boolean
}) => {
  return (
    <div
      className={styles.leftPane}
      style={{
        backgroundImage: !overrideBackgroundColor ? `url(${overrideBackgroundImage || five.src})` : 'none',
        backgroundColor: overrideBackgroundColor || 'none',
        maxWidth: editLink ? 'none' : ''
      }}
    >
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Logo color={overrideLogoColor || 'white' } />
          </a>
        </Link>
      </div>
      {notRegistered && (
        <div className={styles.swagHandContainer}>
          <Image
            src={handImage}
            alt=""
            className={styles.swagHand}
          />
        </div>
      )}
    </div>
  )
}

export const RightPane = ({
  props,
  setPaymentModalIsOpen,
  setSPayModalIsOpen,
  setRPayModalIsOpen,
  setToken,
  editLink
}: {
  props: Props,
  setPaymentModalIsOpen: (isOpen: boolean) => void,
  setSPayModalIsOpen: (isOpen: boolean) => void,
  setRPayModalIsOpen: (isOpen: boolean) => void,
  setToken: (token: string) => void,
  editLink?: boolean
}) => {
  const setParentParams = (token: string) => {
    setToken(token);
    setPaymentModalIsOpen(true);
  }
  const tokens = ['solana', 'usdc', 'usdt', 'bonk'];
  const ipfsURL = props.profilePicture.split('https://')[1];
  const avatarURL = ipfsURL.includes('ipfs') ? `https://i0.wp.com/${ipfsURL}` : props.profilePicture;
  return (
    <div className={styles.rightPane}>
      <img
        className={styles.profilePicture}
        src={avatarURL}
        alt=""
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src=`https://avatars.wagmi.bio/${props.link}`;
        }}
      />
      <div className={styles.profile}>
        <div>
          <p className={styles.name}>{props.name}</p>
          <p className={styles.description}>{props.description}</p>
        </div>
        <RequestButton setRPayModalIsOpen={setRPayModalIsOpen} />
      </div>
      {props.socials
        && props.socials.length > 0
        && (
        <div className={styles.socials}>
          {props.socials.map((social: Social) => (
            <div key={social.name}>
              {social.name && social.link && (
                <icons.GetIcon link={social.link} />
              )}
            </div>
          ))}
        </div>
      )}
      {!editLink && (
        <>
          <div className={styles.buttonGrid}>
            <button
              className={`${styles.solanaPayButton} ${styles.payWithbtn}`}
              onClick={() => setSPayModalIsOpen(true)}
              style={{ marginTop: (props.socials?.length === 0 || !props.socials) ? '3.125rem' : '0rem' }}
            >
              <img src={spayIcon.src} alt="SPay" />
            </button>
          </div>
          <p className={styles.payWithCrypto}>Pay with Browser</p>
          <div className={styles.buttonGrid}>
            {tokens.map((token: string) => (
              <PaymentButton
                key={token}
                textColor={getTokenDetails(token).color}
                bgColor={getTokenDetails(token).background}
                text={`Pay with ${getTokenDetails(token).symbol}`}
                icon={getTokenDetails(token).icon}
                onClick={() => {
                  setParentParams(token)
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
};

const UnavailableLink = ({
  notRegistered,
  price,
  reserved
}: {
  notRegistered: boolean,
  price: string,
  reserved: boolean
}) => {
  const router = useRouter();
  const link = router.query.pay as string;
  const [modal, setModal] = useState(false);
  return (
    <div className={styles.rightPane}>
      <div>
        <Image
          className={styles.unavailableImage}
          alt=""
          src={unavailableImage}
        />
      </div>
      {notRegistered && (
        <div>
          <PricingModal
            isOpen={modal}
            setModal={setModal}
            link={link}
            price={Number(price)}
          />
          <p
            className={styles.bigDarkText}
            style={{ marginTop: '4.5rem' }}
          >@{link} is available</p>
          <p className={styles.lightText}>
            Woohoo, this link is still up for grabs. Register it for as low as $1
          </p>
          <button
            onClick={() => setModal(true)}
            style={{ width: '21.06rem' }}
            className={styles.mainBtn}
          >Register Now</button>
        </div>
      )}
      {reserved && (
        <div
          className={styles.reservedContainer}
        >
          <img
            className={styles.burgerImage}
            src={burgerImage.src}
            alt=""
          />
          <div>
            <p className={styles.bigDarkText}>This link is Reserved</p>
            <p className={styles.lightText}>Uh-Oh Sorry this link is already taken or reserved by someone else</p>
            <button
              onClick={() => router.push('/')}
              className={styles.tryAnotherBtn}
            >Try Another Link</button>
          </div>
        </div>
      )}
    </div>
  )
}
