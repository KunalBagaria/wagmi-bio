import { NextPageContext } from 'next';
import { DefaultHead } from '@/layouts/Head';

type Props = {
  statusCode: any
}

const Error = ({ statusCode }: Props) => (
  <>
    <DefaultHead title="wagmi.bio - making web3 payments easier" />
    <p>
      {statusCode
      ? `An error ${statusCode} occurred on server`
      : 'An error occurred on client'}
    </p>
  </>
);

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
