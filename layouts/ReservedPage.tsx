import toast from 'react-hot-toast';
import tick from '@/images/icons/green-tick.svg';
import date from 'date-and-time';
import styles from '@/styles/Reserved.module.scss';
import { useEffect, useState } from 'react';
import { Connection } from '@solana/web3.js';
import { getRPC } from '@/components/Wallet';
import { useRouter } from 'next/router';

export const ReservedPage = (
  { props }: any
) => {
  const router = useRouter();
  const [counter, setCounter] = useState(0);
  const confirmationPromise = () => new Promise(async (resolve, reject) => {
    console.count('Confirmation promise is running')
    const txid = props.paymentSignature;
    console.log(txid);
    const connection = new Connection(getRPC(), {
      commitment: 'processed'
    });
    try {
      const confirmation = await connection.confirmTransaction(txid);
      if (confirmation.value.err !== null) return;
      const confirmFromBackend = await fetch(`/api/get/user/${props.link}`);
      const { isConfirmed } = await confirmFromBackend.json();
      if (isConfirmed) {
        resolve(true);
        router.push(`/${props.link}`);
      } else {
        reject(false);
      }
    } catch (e: any) {
      const message = Error(e).message.toString();
      console.log(message);
      const hasFailed = message.includes('was not confirmed');
      if (hasFailed) return reject();
    }
  });
  useEffect(() => {
    if (props.isConfirmed) {
      router.push(`/${props.link}`)
      return;
    }
    if (typeof window !== 'undefined' && counter === 0) {
      setCounter(1);
      toast.promise(confirmationPromise(), {
        loading: 'Confirming your transaction',
        success: 'Your link is now available',
        error: 'Transaction failed due to network congestion, please try again after a while',
      })
    }
  }, [props]);

  return (
    <div className={styles.container}>
      <img src={tick.src} />
      <h1 className={styles.heading}>
        Link Reserved
      </h1>
      <p className={styles.sub}>
        {`Your link has been reserved and will be available as soon as the payment is verified.`}
      </p>
      <div className={styles.linkBox}>
        <div className={styles.flex}>
          <img
            src={props.profilePicture}
            className={styles.profilePicture}
          />
          <div
            style={{ marginLeft: '1.5rem' }}
          >
            <p
              style={{ marginTop: '0.25rem' }}
              className={styles.darkText}
            >
              wagmi.bio/{props.link}
            </p>
            <p
              style={{ marginTop: '0.25rem' }}
              className={styles.lightText}
            >
              {props.publicKey.substring(0,4)}....{props.publicKey.substring(40,44)}
            </p>
          </div>
        </div>

        <div
          className={styles.expiresBox}
        >
          <p
            style={{ marginTop: '0.25rem' }}
            className={styles.blackText}
          >
            EXPIRES
          </p>
          <p
            style={{ marginTop: '0.25rem' }}
            className={styles.lightText}
          >
            {date.format(new Date(props.expires), 'DD MMM, YYYY')}
          </p>
        </div>
      </div>
      <button
        className={styles.tweetThis}
        onClick={() => {
          window.open(`
            https://twitter.com/intent/tweet?text=Reserved%20my%20gateway%20to%20Web3%20with%20%40WagmiBio%20LFG!&url=https%3A%2F%2Fwagmi.bio%2F${props.link}
          `, '_blank');
        }}
      >
        Share on Twitter
      </button>
    </div>
  );
}