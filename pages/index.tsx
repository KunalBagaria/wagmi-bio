/* eslint-disable @next/next/no-img-element */
import { DefaultHead } from '@/layouts/Head';
import { Navbar } from '@/layouts/Navbar';
import {
  FirstOveriewSection,
  SecondOveriewSection,
  ThirdOveriewSection,
  FeaturesSection,
  PricingSection,
  GetStartedSection,
} from '@/layouts/Sections';
import { Footer } from '@/layouts/Footer'
import styles from '@/styles/Home.module.scss';
import defaults from '@/styles/Defaults.module.scss';

export default function Home({ price, user, setUser }: { price: string, user?: string, setUser?: any}) {
  return (
    <>
    <DefaultHead title="wagmi.bio - making web3 payments easier" />

    <Navbar user={user} setUser={setUser} />

    <div className={defaults.main}>

      <div className={defaults.heroContainer} id="">
        <FirstOveriewSection price={price} />
      </div>

      <div className={defaults.heroContainer}>
        <SecondOveriewSection />
      </div>

      <div className={defaults.heroContainer}>
        <ThirdOveriewSection price={price} />
      </div>

      <div className={styles.featureSection} id="features">
        <h1 className={styles.featureHeading}>
          <span>Loaded with Features </span>
          and many more coming soon
        </h1>
      </div>

      <FeaturesSection />

      <section className={defaults.heroContainer} id="pricing">
        <PricingSection />
      </section>

      <section className={defaults.heroContainer}>
        <GetStartedSection price={Number(price)} />
      </section>

      <Footer />

    </div>

    </>
  );
}

export const getServerSideProps = async () => {
  try {
    const data = await fetch('https://pricing.wagmi.bio/solana');
    const json = await data.json();
    const { price } = json;
    return { props: { price: price || 0 } };
  } catch (err) {
    console.log(err);
    return {}
  }
};
