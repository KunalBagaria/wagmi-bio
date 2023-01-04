import { MainScreen, Props } from '@/layouts/WSPayment';
import { handlePaymentPageRequest } from '@/util/handlePaymentPageRequest';

export default function Pay(props: Props) {
  return (
    <MainScreen props={props} />
  );
};

export const getServerSideProps = async ({ query }: any) => {
  const response = await handlePaymentPageRequest(query);
  return response;
};