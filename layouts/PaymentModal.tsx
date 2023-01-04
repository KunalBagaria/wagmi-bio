import Modal from 'react-modal';
import styles from '@/styles/WSPayment.module.scss';
import ClickAwayListener from 'react-click-away-listener';

import { Props } from '@/layouts/WSPayment';
import { QRCode } from '@/layouts/InvoicePayment';

import toast from 'react-hot-toast';
import { Keypair, PublicKey } from '@solana/web3.js';

import { getPublicKey, sendMoney } from '@/components/Wallet';
import { sendSPL } from '@/components/SendSPL';
import { getTokenPrice } from '@/util/getTokenPrice';

import { toasterPromise } from '@/util/toasterNetworkPromise';

import sol from "@/images/icons/sol.png"
import usdc from "@/images/icons/usdc.png"
import usdt from "@/images/icons/usdt.png"
import bonk from "@/images/icons/bonk.png"
import spayBg from "@/images/spay-bg.svg"
import Expand from "@/dynamic/Expand";

import { useEffect, useState } from 'react';
import { generateQRCodeURL, getTxId } from '@/components/GenerateQRCode';
import { incrementRevenue } from '@/components/UpdateRevenue';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: 'none',
    border: 'none',
    borderRadius: '1.05rem'
  },
  overlay: {
    backgroundColor: 'rgba(30, 51, 83, 0.39)'
  }
};

export const getTokenDetails = (token: string) => {
  switch (token) {
    case 'solana':
      return {
        color: '#4D5B5D',
        symbol: 'SOL',
        background: 'rgba(208, 208, 208, 0.3)',
        icon: sol.src,
        mint: null,
        decimals: 0,
        price: async () => getTokenPrice('solana')
      }
    case 'usdc':
      return {
        color: 'rgba(39, 117, 202, 1)',
        symbol: 'USDC',
        background: 'rgba(218, 232, 246, 1)',
        icon: usdc.src,
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        decimals: 6,
        price: async () => 1
      }
    case 'usdt':
      return {
        color: 'rgba(47, 114, 96, 1)',
        symbol: 'USDT',
        background: 'rgba(80, 175, 149, 0.19)',
        icon: usdt.src,
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        decimals: 6,
        price: async () => 1
      }
    case 'bonk':
      return {
        color: '#4D5B5D',
        symbol: 'BONK',
        background: 'rgba(208, 208, 208, 0.3)',
        icon: bonk.src,
        mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        decimals: 5,
        price: async () => getTokenPrice('bonk')
      }
    default:
      return {
        color: '#4D5B5D',
        symbol: token.substring(0, 3),
        background: 'rgba(208, 208, 208, 0.3)',
        icon: sol.src,
        mint: null,
        decimals: 0,
        price: async () => 0
      }
  }
}

export const PaymentModal = ({
  isOpen,
  setIsOpen,
  token,
  props,
  setToken,
  setTxid
}: {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  token: string,
  props: Props,
  setToken: (token: string) => void,
  setTxid: (txid: string) => void,
}) => {
  const [selectorIsOpen, setSelectorIsOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const tokenNames = ['solana', 'usdc', 'usdt', 'bonk'];

  const clear = () => {
    setAmount(0);
    setMessage('');
  }

  const sendPaymentToServer = async (txid: string) => {
    const tDetails = getTokenDetails(token);
    const price = await tDetails.price();
    const publicKey = await getPublicKey();
    if (!publicKey || !price) return;
    const amountInUSD = price * amount;
    const sent = await incrementRevenue({
      signature: txid,
      from: publicKey,
      createdAt: new Date(),
      link: props.link,
      amount,
      amountInUSD,
      message,
      token: tDetails.symbol
    })
  }

  const handlePayment = async () => {
    if (token === 'solana') {
      const txid = await sendMoney(
        new PublicKey(props.publicKey),
        amount,
        false,
        message
      );
      console.log(txid);
      if (!txid) return;
      setTxid(txid);
      sendPaymentToServer(txid);
    } else {
      const mint = getTokenDetails(token).mint
      if (!mint)return;
      const txid = await sendSPL(
        mint,
        new PublicKey(props.publicKey),
        amount,
        false,
        message,
        getTokenDetails(token).decimals
      );
      console.log(txid);
      if (!txid) return;
      setTxid(txid);
      sendPaymentToServer(txid);
    }
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        style={customStyles}
        closeTimeoutMS={250}
      >
        <ClickAwayListener onClickAway={() => {
          clear();
          setIsOpen(false)
        }}>
          <div className={styles.modal}>
            <div
              style={{ backgroundColor: getTokenDetails(token).background }}
              className={styles.modalHeroContainer}
            >
              <img
                className={styles.modalTokenIcon}
                src={getTokenDetails(token).icon}
                alt=""
              />
              <p
                className={styles.modalTokenSymbol}
                style={{ color: getTokenDetails(token).color }}
              >
                {getTokenDetails(token).symbol}
              </p>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalTitle}>Paying {
                props.name.split(' ')[0] === props.link
                  ? `@${props.link}` : props.name.split(' ')[0]
              }</p>
              <ClickAwayListener onClickAway={() => setSelectorIsOpen(false)}>
                <div className={styles.modalTokenParent}>
                    <div
                      onClick={() => setSelectorIsOpen(!selectorIsOpen)}
                      className={styles.tokenSelector}
                    >
                      <div className={styles.tokenSelectorDetails}>
                        <img
                          style={{ width: '2rem' }}
                          src={getTokenDetails(token).icon}
                          alt=""
                        />
                        <p className={styles.tokenSelectorTokenName}>{getTokenDetails(token).symbol}</p>
                      </div>
                      <div
                        style={{
                          transform: selectorIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.15s ease-in-out',
                          display: 'flex',
                        }}
                      >
                        <Expand />
                      </div>
                    </div>
                  {selectorIsOpen && (
                    <div className={styles.tokenSelectorTokens}>
                      {tokenNames.map((tokenName) => (
                        <div
                          onClick={() => {
                            setToken(tokenName);
                            setSelectorIsOpen(false)
                          }}
                          style={{ cursor: 'pointer' }}
                          className={`${styles.tokenSelectorDetails} ${styles.tokenSelectorDetailsExp} `}
                        >
                          <img
                            style={{ width: '2rem' }}
                            src={getTokenDetails(tokenName).icon}
                            alt=""
                          />
                          <p className={styles.tokenSelectorTokenName}>{getTokenDetails(tokenName).symbol}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ClickAwayListener>
              <input
                className={styles.modalInput}
                type="number"
                placeholder="Enter an Amount"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <textarea
                className={styles.modalMessage}
                placeholder="Message"
                maxLength={120}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className={styles.mainBtn}
                onClick={() => handlePayment()}
              >
                Pay with {getTokenDetails(token).symbol}
              </button>
            </div>
          </div>
        </ClickAwayListener>
      </Modal>
    </div>
  )
}

export const SolanaPayModal = ({
  isOpen,
  setIsOpen,
  token,
  props,
  setToken,
  setTxid
}: {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  token: string,
  props: Props,
  setToken: (token: string) => void,
  setTxid: (txid: string) => void,
}) => {
  const [selectorIsOpen, setSelectorIsOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [url, setURL] = useState('');
  const [reference, setReference] = useState('');
  const tokenNames = ['solana', 'usdc', 'usdt', 'bonk'];

  const getQRCodeSize = () => {
    if (window.innerWidth < 1100) return 310;
    if (window.innerWidth < 1480) return 330;
    return 360;
  }

  useEffect(() => {
    if (!reference || !isOpen) return;
    (async function() {
      const foundTxId: any = await getTxId(reference);
      if (!foundTxId.signature) return;
      setTxid(foundTxId.signature);
      const tDetails = getTokenDetails(token);
      const price = await tDetails.price();
      if (!price) return;
      const amountInUSD = price * amount;
      const incremented = await incrementRevenue({
        signature: foundTxId.signature,
        from: 'Solana Pay',
        createdAt: new Date(),
        link: props.link,
        amount,
        amountInUSD,
        message,
        token: tDetails.symbol
      })
      clear();
    })();
  }, [reference, isOpen, getTxId, setTxid]);

  const clear = () => {
    setURL('');
    setReference('');
    setAmount(0);
    setMessage('');
  }

  const handlePayment = async () => {
    const referenceKeyPair = Keypair.generate();
    const referencePubKey = referenceKeyPair.publicKey.toBase58();
    setReference(referencePubKey);
    const tDetails = getTokenDetails(token)
    const DMessage = `Payment of ${amount} ${tDetails.symbol.toUpperCase()} to ${props.name}`
    if (token === 'solana') {
      const qrURL = generateQRCodeURL({
        recipient: props.publicKey,
        amount,
        reference: referencePubKey,
        label: `wagmi.bio/${props.link}`,
        message: DMessage,
        memo: message || DMessage,
      })
      setURL(qrURL);
      console.log(qrURL);
    } else {
      const mint = tDetails.mint
      if (!mint)return;
      const qrURL = generateQRCodeURL({
        recipient: props.publicKey,
        amount,
        reference: referencePubKey,
        label: `wagmi.bio/${props.link}`,
        message: DMessage,
        memo: message || DMessage,
        splToken: mint
      })
      setURL(qrURL);
      console.log(qrURL);
    }
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        style={customStyles}
        closeTimeoutMS={250}
      >
        <ClickAwayListener onClickAway={() => {
          clear()
          setIsOpen(false);
        }}>
          <div className={styles.modal}>
            <div
              style={{
                backgroundImage: `url(${spayBg.src})`,
                backgroundColor: '#161616',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              className={styles.modalHeroContainer}
            />
            <div className={styles.modalBody}>
              {!url && (
                <div>
                  <p className={styles.modalTitle}>Paying {
                    props.name.split(' ')[0] === props.link
                      ? `@${props.link}` : props.name.split(' ')[0]
                  }</p>
                  <ClickAwayListener onClickAway={() => setSelectorIsOpen(false)}>
                    <div className={styles.modalTokenParent}>
                        <div
                          onClick={() => setSelectorIsOpen(!selectorIsOpen)}
                          className={styles.tokenSelector}
                        >
                          <div className={styles.tokenSelectorDetails}>
                            <img
                              style={{ width: '2rem' }}
                              src={getTokenDetails(token).icon}
                              alt=""
                            />
                            <p className={styles.tokenSelectorTokenName}>{getTokenDetails(token).symbol}</p>
                          </div>
                          <div
                            style={{
                              transform: selectorIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.15s ease-in-out',
                              display: 'flex',
                            }}
                          >
                            <Expand />
                          </div>
                        </div>
                      {selectorIsOpen && (
                        <div className={styles.tokenSelectorTokens}>
                          {tokenNames.map((tokenName) => (
                            <div
                              onClick={() => {
                                setToken(tokenName);
                                setSelectorIsOpen(false)
                              }}
                              style={{ cursor: 'pointer' }}
                              className={`${styles.tokenSelectorDetails} ${styles.tokenSelectorDetailsExp} `}
                            >
                              <img
                                style={{ width: '2rem' }}
                                src={getTokenDetails(tokenName).icon}
                                alt=""
                              />
                              <p className={styles.tokenSelectorTokenName}>{getTokenDetails(tokenName).symbol}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ClickAwayListener>
                  <input
                    className={styles.modalInput}
                    type="number"
                    placeholder="Enter an Amount"
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <textarea
                    className={styles.modalMessage}
                    placeholder="Message"
                    maxLength={120}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    className={styles.mainBtn}
                    onClick={() => handlePayment()}
                  >
                    Pay with Solana Pay
                  </button>
                </div>
              )}
              {url && (
                <div className={styles.spayQR}>
                  <QRCode
                    url={url}
                    size={getQRCodeSize()}
                  />
                </div>
              )}
            </div>
          </div>
        </ClickAwayListener>
      </Modal>
    </div>
  )
}

export const RequestPaymentModal = ({
  isOpen,
  setIsOpen,
  token,
  props,
  setToken,
}: {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  token: string,
  props: Props,
  setToken: (token: string) => void,
}) => {
  const [selectorIsOpen, setSelectorIsOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const tokenNames = ['solana', 'usdc', 'usdt', 'bonk'];

  const clear = () => {
    setAmount(0);
    setMessage('');
  }

  const handlePayment = async () => {
    const from = await getPublicKey();
    if (!from || (amount === 0)) return;
    const request = fetch('/api/request/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        token: getTokenDetails(token).symbol,
        link: props.link,
        from,
        to: props.publicKey,
        message,
      })
    })
    toast.promise(toasterPromise(request), {
      loading: 'Sending Request',
      success: 'Request Sent',
      error: 'Error Sending Request',
    })
    clear();
    setIsOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        style={customStyles}
        closeTimeoutMS={250}
      >
        <ClickAwayListener onClickAway={() => {
          clear()
          setIsOpen(false);
        }}>
          <div className={styles.modal}>
            <div
              style={{
                backgroundColor: getTokenDetails(token).background,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              className={styles.modalHeroContainer}
            >
              <img
                className={styles.profilePicture}
                src={props.profilePicture}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src=`https://avatars.wagmi.bio/${props.link}`;
                }}
              />
            </div>
            <div className={styles.modalBody}>
              <div>
                <p className={styles.modalTitle}>Send Payment Request</p>
                <ClickAwayListener onClickAway={() => setSelectorIsOpen(false)}>
                  <div className={styles.modalTokenParent}>
                      <div
                        onClick={() => setSelectorIsOpen(!selectorIsOpen)}
                        className={styles.tokenSelector}
                      >
                        <div className={styles.tokenSelectorDetails}>
                          <img
                            style={{ width: '2rem' }}
                            src={getTokenDetails(token).icon}
                            alt=""
                          />
                          <p className={styles.tokenSelectorTokenName}>{getTokenDetails(token).symbol}</p>
                        </div>
                        <div
                          style={{
                            transform: selectorIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease-in-out',
                            display: 'flex',
                          }}
                        >
                          <Expand />
                        </div>
                      </div>
                    {selectorIsOpen && (
                      <div className={styles.tokenSelectorTokens}>
                        {tokenNames.map((tokenName) => (
                          <div
                            onClick={() => {
                              setToken(tokenName);
                              setSelectorIsOpen(false)
                            }}
                            style={{ cursor: 'pointer' }}
                            className={`${styles.tokenSelectorDetails} ${styles.tokenSelectorDetailsExp} `}
                          >
                            <img
                              style={{ width: '2rem' }}
                              src={getTokenDetails(tokenName).icon}
                              alt=""
                            />
                            <p className={styles.tokenSelectorTokenName}>{getTokenDetails(tokenName).symbol}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ClickAwayListener>
                <input
                  className={styles.modalInput}
                  type="number"
                  placeholder="Enter an Amount"
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <textarea
                  className={styles.modalMessage}
                  placeholder="Message"
                  maxLength={120}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className={styles.mainBtn}
                  onClick={() => handlePayment()}
                >
                  Request Payment
                </button>
              </div>
            </div>
          </div>
        </ClickAwayListener>
      </Modal>
    </div>
  )
}

