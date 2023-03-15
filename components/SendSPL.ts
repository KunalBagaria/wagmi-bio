import getWallet from '@/util/whichWallet';
import { toast } from 'react-hot-toast';
import {
  PublicKey,
  Transaction,
  Connection,
  Keypair,
  TransactionInstruction
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';
import { connectWallet } from './Wallet';

export function getConnection() {
  const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake', {
    commitment: 'processed',
  });
  return connection;
}

async function getTransferTokenTransaction(
  amount: number,
  decimals: number,
  fromAddress: PublicKey,
  toAddress: PublicKey,
  mintAddress: PublicKey,
) {
  const connection = getConnection();
  const senderAccountAddress = getAssociatedTokenAddressSync(
    mintAddress,
    fromAddress,
  );
  const senderAccount = await connection.getAccountInfo(senderAccountAddress);

  if (senderAccount === null) {
    console.log('Sender account does not exist');
    return null;
  }

  const receiverAccountAddress = getAssociatedTokenAddressSync(
    mintAddress,
    toAddress,
  );
  const receiverAccount = await connection.getAccountInfo(
    receiverAccountAddress,
  );

  const transaction = new Transaction();

  if (receiverAccount === null) {
    console.log('Receiver account does not exist');
    transaction.add(
      createAssociatedTokenAccountInstruction(
        toAddress,
        receiverAccountAddress,
        toAddress,
        mintAddress,
      ),
    );
  }

  transaction.add(
    createTransferInstruction(
      senderAccountAddress,
      receiverAccountAddress,
      fromAddress,
      Number(amount) * 10 ** decimals,
    ),
  );

  const {blockhash} = await connection.getLatestBlockhash('finalized');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromAddress;

  return transaction;
}


export const sendSPL = async (
  mint: string,
  toWallet: PublicKey,
  amount: number,
  showToast?: boolean,
  message?: string,
  decimals = 6
) => {
  const connection = getConnection();
  const wallet = getWallet();
  const sender = await connectWallet();

  const transaction = await getTransferTokenTransaction(
    amount,
    decimals,
    sender,
    toWallet,
    new PublicKey(mint)
  );

  if (!transaction) {
    toast.error('Failed to create transaction');
    return;
  }

  if (message) {
    transaction.add(
      new TransactionInstruction({
        keys: [{ pubkey: toWallet, isSigner: true, isWritable: true }],
        data: Buffer.from(message, 'utf8'),
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      })
    );
  }

  let signedTransaction: any = null;

  if (wallet) {
    try {
      signedTransaction = await wallet.signTransaction(transaction);
    } catch (e: any) {
      return;
    }
  } else return;

  const txid = await connection.sendRawTransaction(signedTransaction.serialize())
    .catch((err) => {
      console.log(err);
    });
  if (txid) {
    if (!showToast) {
      toast.promise(
        connection.confirmTransaction(txid, 'processed'), {
          loading: 'Confirming Transaction',
          success: 'Transaction Confirmed',
          error: 'Transaction Failed',
        },
      );
    }
    return txid;
  }
  toast.error('Failed to send transaction');
};
