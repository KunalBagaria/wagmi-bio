import { useState, useEffect } from 'react';
import { Sidebar } from '@/layouts/Sidebar';
import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import { PaymentRequests } from '@/layouts/PaymentRequests';
import { InfoMessage } from '@/layouts/InfoMessages';
import dashStyles from '@/styles/Dashboard.module.scss';

export default function RequestsPage({ setUser, user }: { setUser: any, user: string }) {
  const [publicKey, setDashPubKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (publicKey) {
        const rRequest = await fetch(`/api/get/requests/${publicKey}`)
        const fRequests = await rRequest.json()
        const lRequest = await fetch(`/api/get/links/${publicKey}`)
        const fLinks = await lRequest.json()
        if (fRequests.length > 0) {
          setTransactions(fRequests);
          setLinks(fLinks);
          setError('');
        } else {
          setError("Oops, you don't have any requests in your account yet.");
        }
        setLoading(false);
      } else {
        setLoading(false);
        setError('Please connect your wallet');
      }
    };
    fetchRequests();
  }, [publicKey]);

  return (
    <>
      <DefaultHead title="Payment Requests" />
      <Navbar setUser={setUser} user={user} dashboard setDashPubKey={setDashPubKey} />
      <main className={dashStyles.main} style={{ overflowX: 'auto' }}>
        <Sidebar />
        <InfoMessage error={error} loading={loading} />
        {!error && !loading && transactions[0] && (
          <PaymentRequests links={links} requests={transactions} />
        )}
      </main>
    </>
  );
}