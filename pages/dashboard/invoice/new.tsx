import { useState, useEffect } from 'react';
import { Sidebar } from '@/layouts/Sidebar';
import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import { InfoMessage } from '@/layouts/InfoMessages';
import { CreateInvoice } from '@/layouts/CreateInvoice';
import dashStyles from '@/styles/Dashboard.module.scss';

export default function Invoice({ setUser, user }: { setUser: any, user: string }) {
  const [publicKey, setDashPubKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [links, setLinks] = useState<any>([]);

  useEffect(() => {
    const fetchLinks = () => {
      if (publicKey) {
        setLoading(true);
        setError('');
        fetch(`/api/get/links/${publicKey}`)
        .then((res) => res.json())
        .then((res) => {
          const proLinks = res.filter((link: any) => link.plan > 1)
          if (proLinks.length > 0) {
            setLinks(proLinks);
          } else {
            setError("Sorry, you don't have any links with professional plan");
          }
          setLoading(false);
        })
        .catch((err) => console.log(err));
      } else {
        setError('Please connect your wallet');
      }
    };
    fetchLinks();
  }, [publicKey]);

  return (
    <>
      <DefaultHead title="Send Invoice" />
      <Navbar setUser={setUser} user={user} dashboard setDashPubKey={setDashPubKey} />

      <main className={dashStyles.main}>
        <Sidebar />
        <InfoMessage error={error} loading={loading} />
        {!error && !loading && links[0] && (
          <CreateInvoice links={links} />
        )}
      </main>
    </>
  );
}
