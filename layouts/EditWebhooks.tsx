import { useState } from 'react';
import { toasterPromise } from '@/util/toasterNetworkPromise';
import dashStyles from '@/styles/Dashboard.module.scss'
import styles from '@/styles/EditWebhooks.module.scss'
import defaults from '@/styles/Defaults.module.scss';
import DiscordIcon from '@/images/socials/discord-wordmark.svg';
import toast from 'react-hot-toast';
import { getPublicKey, signOTP } from '@/components/Wallet';

export const EditWebhooks = () => {
  const [discord, setDiscord] = useState('');

  const handleSubmit = async () => {
    const publicKey = await getPublicKey();
    const signature = await signOTP();
    if (!publicKey || !signature) return;
    const request = fetch('/api/webhook/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discord,
        publicKey,
        signature,
      }),
    });
    toast.promise(toasterPromise(request), {
      loading: 'Saving Webhook',
      success: 'Webhook Saved',
      error: 'Error Saving Webhook',
    });
  }

  return (
    <div className={defaults.paddedContainer}>
      <div>
        <p className={dashStyles.dashboardHeading} style={{ marginBottom: '0.2rem', marginTop: '0rem' }}>Webhooks</p>
        <p className={dashStyles.dashboardSubHeading} style={{ marginTop: '0.5rem', marginBottom: '0rem' }}>Get notified when you get paid</p>
      </div>
      <div className={styles.container}>
        <div>
          <div className={styles.selector}>
            <div
              style={{ background: 'rgba(222, 233, 252, 0.23)' }}
              className={styles.selectorItem}
            >
              <img src={DiscordIcon.src} alt="Discord" />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className={defaults.newBtn}
          >Update Webhook</button>
        </div>
        <div className={styles.webhookContainer}>
          <p
            className={dashStyles.dashboardSubHeading}
          >Update Webhook URL</p>
          <input
            placeholder="Discord Webhook URL"
            className={defaults.defaultInput}
            onChange={(e) => setDiscord(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}