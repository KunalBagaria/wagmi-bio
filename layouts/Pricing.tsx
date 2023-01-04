import { useState, useEffect } from 'react'
import { buyDomain } from '@/components/BuyDomain';
import Modal from 'react-modal';
import styles from "@/styles/Pricing.module.scss"
import tick from '@/images/icons/tick.svg'
import cross from '@/images/icons/cross.svg'

export const Pricing = ({ dummy, setParentPlan }: { dummy: boolean, setParentPlan?: any }) => {

  const [plan, setPlan] = useState<number>(1)

  const plans = [
    { price: '$1', name: 'Basic', tagline: 'Just the link' },
    { price: '$10', name: 'Pro', tagline: 'Link + All Features'}
  ]

  const handlePlanChange = () => {
    setPlan(plan === 1 ? 2 : 1)
    setParentPlan(plan === 1 ? 2 : 1)
  }

  return (
    <>
      {plans.map((mapped, index) => (
        <div key={index}
          style={{
            outline: plan === (index + 1) && !dummy ? '0.25rem solid #377BFF' : 'none',
            cursor: dummy ? 'default' : 'pointer',
          }}
          className={styles.paymentBox}
          onClick={() => dummy ? null : handlePlanChange()}
        >
          <div className={styles.priceBoxHeader}>
            <div className={styles.checkParent}>
              {!dummy && (
                <span style={{ outline: plan !== (index + 1) ? '0.1rem solid #CECECE' : ''}}>
                  {plan === (index + 1) && (
                    <img src={tick.src}></img>
                  )}
                </span>
              )}
              <p className={styles.planName}>{mapped.name}</p>
            </div>
            <p className={styles.price}><span>{mapped.price}</span></p>
          </div>
          <p className={styles.tagline}>{mapped.tagline}</p>
        </div>
      ))}
    </>
  )
}



export const PricingModal = ({ isOpen, setModal, link, price }: { isOpen: boolean, setModal: any, link: string, price: number }) => {

  const customStyles = {
    content: {
    top: '50%',
    padding: '3rem 3rem',
    borderRadius: '1.2rem',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    zIndex: 100000000000000,
    transform: 'translate(-50%, -50%)',
    },
  };

  const [plan, setPlan] = useState<number>(1)

  useEffect(() => {
    Modal.setAppElement('#__next');
    const listener = (evt: KeyboardEvent) => {
      const keyname = evt.key;
      if (keyname === 'Escape') {
        setModal(false)
      }
    }
    window.addEventListener('keyup', listener)
    return () => window.removeEventListener('keyup', listener)
  }, [setModal])

  return (
    <div>
      <Modal isOpen={isOpen} style={customStyles}>
        <div className={styles.closeParent}>
          <button className={styles.closeBtn} onClick={() => setModal(false)}><img src={cross.src}></img></button>
          <p>wagmi.bio/{link}</p>
        </div>
        <Pricing dummy={false} setParentPlan={setPlan} />
        <button onClick={() => buyDomain(link, price, plan)} className={styles.button}>Pay with SOL</button>
        <button onClick={() => buyDomain(link, price, plan, true)} className={styles.button}>Burn BONK</button>
      </Modal>
    </div>
  );

}