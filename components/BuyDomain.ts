import toast from 'react-hot-toast';
import getWallet from '@/util/whichWallet';
import { PublicKey } from '@solana/web3.js';
import { sendMoney } from '@/components/Wallet';
import { validateReservedLink } from './ValidateLink';
import { burnSPL } from './BurnSPL';

export const buyDomain = async (
  link: string,
  price: number,
  plan?: number,
  bonk = false
) => {
  const isReserved = validateReservedLink(link);
  const wallet = getWallet();

  if (isReserved) {
    toast.error("You can't register this link");
    return;
  }

  const doesItExist = await fetch(`/api/get/user/${link}`);
  const userExists = await doesItExist.json();

  if (userExists?._id) {
    toast.error('This link is already registered');
    return;
  }

  let signature = '';

  if (!bonk) {
    const wagmiPublicKey = new PublicKey('8kgbAgt8oedfprQ9LWekUh6rbY264Nv75eunHPpkbYGX');
    const oneDollar = (1 / price);
    const tenDollar = (10 / price);
    const cost = plan === 1 ? oneDollar : tenDollar;
    const _signature = await sendMoney(wagmiPublicKey, cost, false);
    if (_signature) signature = _signature; else return;
  } else {
    const bonkToBurn = plan === 1 ? 10**6 : 10**7;
    const _signature = await burnSPL('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', bonkToBurn, 5);
    if (_signature) signature = _signature; else return;
  }

  const pubKey = wallet.publicKey;

  if (!pubKey) {
    toast.error("Couldn't connect to wallet. Please contact support to help you out with this");
    return;
  }

  const data = {
    link,
    publicKey: pubKey.toString(),
    signature,
    plan,
  };

  console.table?.(data);

  const request = fetch(`/api/register${bonk ? '_bonk' : ''}`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  toast.promise(
    request, {
      loading: 'Reserving your link',
      success: 'Link reserved',
      error: 'Link reservation failed, please contact support',
    },
  );

  const res = await request;
  const response = await res.json();

  if (response.success) {
    window.location.href = `/${link}/reserved`;
  } else {
    toast.error(`Failed to register link: ${response.detail}`);
  }
};
