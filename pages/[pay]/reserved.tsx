import { Navbar } from '@/layouts/Navbar';
import { DefaultHead } from '@/layouts/Head';
import { handlePaymentPageRequest } from '@/util/handlePaymentPageRequest';
import { ReservedPage } from '@/layouts/ReservedPage';

type Props = {
  user?: string,
  setUser?: any,
  name: string,
  link: string,
  publicKey: string,
  profilePicture: string,
  paymentSignature: string,
  description: string,
  background: string,
  isConfirmed: boolean,
  verified?: boolean,
  price: string,
  error: any
}

export default function Reserved(props: Props) {
	return (
		<>
      <DefaultHead title={`Reserved Link - ${props.link}`} />
			<Navbar user={props.user} setUser={props.setUser} />
      {props.link && (
        <ReservedPage props={props} />
      )}
		</>
	);
}

export const getServerSideProps = async ({ query }: any) => {
  const response = await handlePaymentPageRequest(query);
  return response;
};