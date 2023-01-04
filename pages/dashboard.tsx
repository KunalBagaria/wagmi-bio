import { useState } from 'react';
import { DashboardLinks } from '@/layouts/DashboardLinks';
import { Navbar } from '@/layouts/Navbar';
import { Sidebar } from '@/layouts/Sidebar';
import { DefaultHead } from '@/layouts/Head';
import styles from '@/styles/Dashboard.module.scss';

export default function Dashboard({ user, setUser }: { user?: string, setUser?: any }) {
  const [publicKey, setDashPubKey] = useState<string>('');

  return (
    <>
      <DefaultHead title="Dashboard" />
      <Navbar setUser={setUser} user={user} dashboard setDashPubKey={setDashPubKey} />

      <main className={styles.main}>
        <Sidebar />
        <DashboardLinks pubKey={publicKey} />
      </main>
    </>
  );
}