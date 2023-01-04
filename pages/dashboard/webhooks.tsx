import { useState, useEffect } from 'react';
import { Sidebar } from '@/layouts/Sidebar';
import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import { InfoMessage } from '@/layouts/InfoMessages';
import { EmbedLink } from '@/layouts/EmbedLink';
import dashStyles from '@/styles/Dashboard.module.scss';
import { EditWebhooks } from '@/layouts/EditWebhooks';

export default function Webhooks({ setUser, user }: { setUser: any, user: string }) {
  const [publicKey, setDashPubKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [links, setLinks] = useState<any>([]);

  useEffect(() => {
    const fetchLinks = () => {
      if (publicKey) {
        fetch(`/api/get/links/${publicKey}`)
        .then((res) => res.json())
        .then((res) => {
          const proLinks = res.filter((link: any) => link.plan > 1);
          setLoading(false);
          if (proLinks.length > 0) {
            setLinks(proLinks);
            setError('');
          } else {
            setError("Oops, you don't have any links with the professional plan.");
          }
        })
        .catch((err) => console.log(err));
      } else {
        setLoading(false);
        setError('Please connect your wallet');
      }
    };
    fetchLinks();
  }, [publicKey]);

  console.log(links);

  return (
    <>
      <DefaultHead title="Webhooks" />
      <Navbar setUser={setUser} user={user} dashboard setDashPubKey={setDashPubKey} />
      <main className={dashStyles.main} style={{ overflowX: 'auto' }}>
        <Sidebar />
        <InfoMessage error={error} loading={loading} />
        {!error && !loading && links[0] && (
          <EditWebhooks />
        )}
      </main>
    </>
  );
}