import { useEffect } from 'react'
import Modal from 'react-modal';
import styles from "@/styles/Pricing.module.scss"
import cross from '@/images/icons/cross.svg'

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
}

export const IframeModal = ({ isOpen, setModal, src, height, id }: { isOpen: boolean, setModal: any, src: string, height: string, id?: string }) => {
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
        </div>
        <iframe id={id} src={src} style={{ border: 'none', borderRadius: '1.5rem', width: '35rem', marginTop: '2rem', height: height }}></iframe>
      </Modal>
    </div>
  );
}