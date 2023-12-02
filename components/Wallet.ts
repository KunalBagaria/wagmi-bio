import {
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  TransactionInstruction
} from '@solana/web3.js';
import toast from 'react-hot-toast';
import getWallet from '@/util/whichWallet';
import {
  getOTP,
} from './GetOTP';
import { getConnection } from './SendSPL';

declare global {
  interface Window {
    solana: any,
    solflare: any,
    sollet: any
  }
}

export const connectWallet = async () => {
  const wallet = getWallet();
  if (wallet) {
    const response = await wallet.connect();
    if (response || response.publicKey) {
      toast.success('Connected to wallet');
    } else {
      toast.error('Failed to connect to wallet');
      return;
    }
    return wallet.publicKey;
  }
  toast.error('No Solana wallets found');
  window.open('https://phantom.app/', '_blank');
};

export const getPublicKey = async () => {
  const wallet = getWallet();
  if (wallet) {
    const response = await wallet.connect();
    return wallet.publicKey.toString();
  }
  toast.error('No Solana wallets found');
  window.open('https://phantom.app/', '_blank');
};

export const disconnectWallet = async () => {
  const wallet = getWallet();
  if (wallet) {
    await wallet.disconnect();
    toast.success('Disconnected from wallet');
  }
};

export const sendMoney = async (
  to: PublicKey,
  amount: number,
  showToast?: boolean,
  message?: string
) => {
  const wallet = getWallet();
  const publicKey = await connectWallet();
  const connection = getConnection();

  const roundedNumber = Number(amount.toFixed(5));

  const transaction = new Transaction()
    .add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: to,
        lamports: roundedNumber * LAMPORTS_PER_SOL,
      }),
    );
  if (message) {
    transaction.add(
      new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(message, 'utf8'),
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      })
    );
  }

  const {blockhash} = await connection.getLatestBlockhash('finalized');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = publicKey;

  const signedTransaction = await wallet.signTransaction(transaction);
  try {
    const txid = await connection.sendRawTransaction(signedTransaction.serialize());
    if (!txid) throw new Error('txid is undefined');
    const verified = connection.confirmTransaction(txid);
    if (showToast) {
      toast.promise(
        verified, {
          loading: 'Confirming Transaction',
          success: 'Transaction Confirmed',
          error: 'Transaction Failed',
        },
      );
    }
    return txid;
  } catch (error) {
    console.error(error);
    toast.error('Failed to send transaction');
  }
};

export const signMessage = async (message: string) => {
  const wallet = getWallet();
  const encodedMessage = new TextEncoder().encode(message);
  const signedMessage = await wallet.signMessage(encodedMessage, 'utf8');
  return signedMessage;
};

export const walletIsConnected = () => {
  const wallet = getWallet();
  return wallet.isConnected;
};

export const signOTP = async () => {
  const isConnected = walletIsConnected();
  const wallet = getWallet();
  toast('Please sign a message in your wallet to authorize this action');
  if (!isConnected) {
    const encodedPubKey = await connectWallet();
    const publicKey = encodedPubKey.toString();
    const otp = await getOTP(publicKey);
    const signature: any = await signMessage(otp);
    return signature;
  }
  const publicKey = wallet.publicKey.toString();
  const otp = await getOTP(publicKey);
  const signature: any = await signMessage(otp);
  return signature;
};

export const connectIfTrusted = () => {
  const wallet = getWallet();
  if (wallet) {
    return wallet.connect({
      onlyIfTrusted: true,
    });
  }
};

export const getRPC = () => 'https://solana-mainnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake'