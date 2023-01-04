import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import { NotFound } from '@/layouts/404';

export default function NotFound404() {
  return (
  <>
    <DefaultHead title="404" />
    <Navbar />
    <NotFound />
  </>
  );
}
