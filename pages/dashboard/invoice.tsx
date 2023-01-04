import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast'
import { Sidebar } from '@/layouts/Sidebar';
import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import { InfoMessage } from '@/layouts/InfoMessages';
import { UserInvoices } from '@/layouts/UserInvoices';
import dashStyles from '@/styles/Dashboard.module.scss';

type Props = {
  price: number,
  setUser?: any,
  user?: string
}

export default function Invoice(props: Props) {
  const [publicKey, setDashPubKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [invoices, setInvoices] = useState<any>([]);
  const { user, setUser } = props;

  useEffect(() => {
    const fetchInvoices = () => {
    if (publicKey) {
      fetch(`/api/get/invoices/${publicKey}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.length > 0) {
          setInvoices(res);
          setError('');
        } else {
          setError("Oops, it seems you don't have any invoices yet");
        }
      })
      .catch((err) => console.log(err));
    } else {
      setLoading(false);
      setError('Please connect your wallet');
    }
    };
    fetchInvoices();
  }, [publicKey]);

  return (
    <>
    <DefaultHead title="Invoicing" />

    <Navbar setUser={setUser} user={user} dashboard setDashPubKey={setDashPubKey} />
    <main className={dashStyles.main} style={{ overflowX: 'auto' }}>
      <Sidebar />
      <InfoMessage error={error} loading={loading} />
      {!error && !loading && invoices[0] && <UserInvoices invoices={invoices} price={props.price} />}
    </main>
    </>
  );
}

export const getServerSideProps = async () => {
  const data = await fetch("https://pricing.wagmi.bio/solana");
  const json = data.ok ? await data.json() : null
  const price = json?.price
  return { props: { price } }
}