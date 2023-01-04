import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast'
import { Sidebar } from '@/layouts/Sidebar';
import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import { DashboardLink } from '@/layouts/DashboardLink';
import { validateReservedLink } from '@/components/ValidateLink';
import { InfoMessage } from '@/layouts/InfoMessages';
import dashStyles from '@/styles/Dashboard.module.scss';

type Props = {
  link: any,
  price: number,
  error: string,
  user?: string,
  setUser?: any
}

export default function Link(props: Props) {
  const [publicKey, setDashPubKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [link] = useState<any>(props.link ? props.link : {});
  const { user, setUser } = props

  useEffect(() => {
    if (publicKey && link?.publicKey !== publicKey) {
      setError("You can't edit this link");
    } else if (!publicKey) {
      setLoading(false);
      setError('Please connect your wallet');
    } else if (publicKey && link?.publicKey === publicKey) {
      setLoading(false);
      setError('');
    }
  }, [publicKey, link]);

  return (
    <>
      <DefaultHead title="Link Details" />
      <Navbar setUser={setUser} user={user} dashboard setDashPubKey={setDashPubKey} />

      <main className={dashStyles.main} style={{ overflowX: 'auto' }}>
        <Sidebar />
        <InfoMessage loading={loading} error={error} />
        {!error && !loading && <DashboardLink price={props.price} link={link} />}
      </main>
    </>
  );
}

export const getServerSideProps = async ({ query }: any) => {
  const reserved = validateReservedLink(query.link);
  if (reserved) {
    return { props: { error: "You can't view this link" } };
  }
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://wagmi.bio';
  const user = await fetch(`${baseURL}/api/get/user/${query.link}`);
  const userData = await user.json();
  const data = await fetch("https://pricing.wagmi.bio/solana");
  const json = data.ok ? await data.json() : null
  const price = json?.price
  if (userData.link) {
    return { props: { link: { ...userData }, price: data.ok ? price : 0 } };
  }
  return { props: { error: userData.detail ? userData.detail : 'There was an error fetching this page' } };
};