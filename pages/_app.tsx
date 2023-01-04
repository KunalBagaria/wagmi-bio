import {
  ComponentType,
  useState
} from 'react';
import { Toaster } from 'react-hot-toast'
import 'normalize.css';
import '@/styles/globals.scss';

type Props = {
  Component: ComponentType < any >
    pageProps: any
}

function MyApp({
  Component,
  pageProps
}: Props) {
  const [publicKey, setPublicKey] = useState<string>('');
  return (
    <>
      <Component {
        ...pageProps
      } setUser={setPublicKey} user={publicKey} />
      <Toaster />
    </>
  );
}

export default MyApp;