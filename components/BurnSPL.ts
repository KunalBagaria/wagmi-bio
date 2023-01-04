import {
  PublicKey,
  Transaction,
  Connection,
  Keypair
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  Token
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

  // Construct wallet keypairs
  const fromWallet = Keypair.generate();
  const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake', {
    commitment: 'processed'
  });

  // Construct my token class
  const SPL_pubkey = new PublicKey(mint);
  const SPL_Token = new Token(
    connection,
    SPL_pubkey,
    TOKEN_PROGRAM_ID,
    fromWallet,
  );

  let fromTokenAccount;

  try {
    fromTokenAccount = await SPL_Token.getOrCreateAssociatedAccountInfo(burner);
    // Create associated token accounts for the recipient if they don't exist yet
  } catch (error: any) {
    toast.error(`${error.message} for SPL token of the burner`);
    return;
  }

  const transaction = new Transaction();

  // Add token burn instructions to transaction
  transaction.add(
    Token.createBurnInstruction(
      SPL_Token.programId,
      SPL_pubkey,
      fromTokenAccount.address,
      burner,
      [],
      amount * (10 ** decimals)
    )
  );

  let signedTransaction: any = null;
  const {
    blockhash,
  } = await connection.getRecentBlockhash();

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
