import {
  PublicKey,
  Transaction,
  Connection,
  Keypair
} from '@solana/web3.js';
import {
  createBurnInstruction,
  getAssociatedTokenAddressSync
} from '@solana/spl-token';
import {
  toast,
} from 'react-hot-toast';
import getWallet from '@/util/whichWallet';
import {
  connectWallet,
} from './Wallet';

export const burnSPL = async (
  mint: string,
  amount: number,
  decimals = 6
) => {
  const wallet = getWallet();
  const burner = await connectWallet();
  const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake', {
    commitment: 'processed'
  });

  const burnerAccountAddress = getAssociatedTokenAddressSync(
    new PublicKey(mint),
    burner
  );
  const burnerAccount = await connection.getAccountInfo(burnerAccountAddress);

  if (burnerAccount === null) {
    console.log('Burner account does not exist');
    return null;
  }

  const transaction = new Transaction();

  // Add token burn instructions to transaction
  transaction.add(
    createBurnInstruction(
      burnerAccountAddress,
      new PublicKey(mint),
      burner,
      amount * (10 ** decimals)
    )
  );

  let signedTransaction: any = null;
  const {blockhash} = await connection.getLatestBlockhash('finalized');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = burner;

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
    return txid;
  }
  toast.error('Failed to send transaction');
};
