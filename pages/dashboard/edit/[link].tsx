import { useState, useEffect } from 'react';
import { Sidebar } from '@/layouts/Sidebar';
import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import { EditLink } from '@/layouts/EditLink';
import { validateReservedLink } from '@/components/ValidateLink';
import { Loading } from '@/layouts/Loading';
import { InfoMessage } from '@/layouts/InfoMessages';
import dashStyles from '@/styles/Dashboard.module.scss';

type Props = {
  link: any,
  error: string,
  user?: string,
  setUser?: any
}

export default function Edit(props: Props) {
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
      <DefaultHead title="Edit Link" />
      <Navbar user={user} setUser={setUser} dashboard setDashPubKey={setDashPubKey} />
      <main className={dashStyles.main} style={{ overflowX: 'auto' }}>
        <Sidebar />
        <InfoMessage loading={loading} error={error} />
        {!error && !loading && <EditLink link={link} />}
      </main>
    </>
  );
}

export const getServerSideProps = async ({ query }: any) => {
  const reserved = validateReservedLink(query.link);
  if (reserved) {
    return { props: { error: "You can't edit this link" } };
  }
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://wagmi.bio';
  const user = await fetch(`${baseURL}/api/get/user/${query.link}`);
  const userData = await user.json();
  if (userData.link) {
    return { props: { link: { ...userData } } };
  }
  return { props: { error: userData.detail ? userData.detail : 'There was an error fetching this page' } };
};