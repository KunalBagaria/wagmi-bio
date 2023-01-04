import { useState, useEffect } from 'react';
import { Sidebar } from '@/layouts/Sidebar';
import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import { InfoMessage } from '@/layouts/InfoMessages';
import { Transactions } from '@/layouts/Transactions';
import dashStyles from '@/styles/Dashboard.module.scss';

export default function TransactionPage({ setUser, user }: { setUser: any, user: string }) {
  const [publicKey, setDashPubKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      if (publicKey) {
        const tRequest = await fetch(`/api/get/transactions/${publicKey}`)
        const fTransactions = await tRequest.json()
        const lRequest = await fetch(`/api/get/links/${publicKey}`)
        const fLinks = await lRequest.json()
        const proLinks = fLinks.filter((link: any) => link.plan > 1)
        if (proLinks.length === 0) {
          setError('Oops, you don\'t have any links with the professional plan.');
          setLoading(false);
          return
        }
        if (fTransactions.length > 0) {
          setTransactions(fTransactions);
          setLinks(fLinks);
          setError('');
        } else {
          setError("Oops, you don't have any transactions in your account yet.");
        }
        setLoading(false);
      } else {
        setLoading(false);
        setError('Please connect your wallet');
      }
    };
    fetchTransactions();
  }, [publicKey]);

  return (
    <>
      <DefaultHead title="Transactions" />
      <Navbar setUser={setUser} user={user} dashboard setDashPubKey={setDashPubKey} />
      <main className={dashStyles.main} style={{ overflowX: 'auto' }}>
        <Sidebar />
        <InfoMessage error={error} loading={loading} />
        {!error && !loading && transactions[0] && <Transactions links={links} transactions={transactions} /> }
      </main>
    </>
  );
}