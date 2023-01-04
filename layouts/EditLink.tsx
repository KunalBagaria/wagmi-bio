import { useState } from 'react';
import { signOTP } from '@/components/Wallet'
import { toasterPromise } from '@/util/toasterNetworkPromise';
import uploadButton from '@/images/upload.svg';
import isURL from 'validator/lib/isURL';
import invStyles from '@/styles/Invoice.module.scss'
import plus from '@/images/icons/blue-plus.svg'
import check from '@/images/icons/check.svg'
import first from '@/images/icons/gradients/one.png'
import second from '@/images/icons/gradients/two.png'
import third from '@/images/icons/gradients/three.png'
import fourth from '@/images/icons/gradients/four.png'
import fifth from '@/images/icons/gradients/five.png'
import styles from '@/styles/Edit.module.scss'
import dashStyles from '@/styles/Dashboard.module.scss'
import defaultStyles from '@/styles/Defaults.module.scss'
import toast from "react-hot-toast"
import { MainScreen } from './WSPayment';
import { uploadFile } from '@/components/Upload';

type Props = {
  link: any
}

const gradients = [first, second, third, fourth, fifth]

const gradientCount = ['one', 'two', 'three', 'four', 'five']

export const EditLink = (props: Props) => {
  const [link, setLink] = useState(props.link)
  const [socials, setSocials] = useState(props.link.socials ? props.link.socials : [{ name: '', url: '' }])
  const [uploading, setUploading] = useState(false);

  const onDescriptionChange = (e: any) => {
    const description = e.target.value;
    setLink({
      ...link,
      description: description
    })
  }

  const onNameChange = (e: any) => {
    const name = e.target.value;
    setLink({
      ...link,
      name: name
    })
  }

  const onImageChange = async (e: any) => {
    const image = e.target.files[0];
    if (!image) return;
    setUploading(true);
    const url = uploadFile(image);
    toast.promise(url, {
      loading: 'Uploading avatar...',
      success: 'Avatar uploaded! It may take a while before it loads',
      error: 'Error uploading avatar'
    });
    const imageURL = await url;
    setLink({
      ...link,
      profilePicture: imageURL
    })
    setUploading(false);
  }

  const onBackgroundChange = (input: string) => {
    setLink({
      ...link,
      background: input
    })
  }

  const handleSubmit = async () => {
    if (uploading) {
      toast('Please wait while your avatar is uploaded');
      return;
    }
    let errored = false;
    socials.forEach((social: any) => {
      if (!social.name && !social.link) return;
      const validURL = isURL(social.link, {
        require_protocol: true,
      });
      if (!validURL && !errored) {
        toast.error(`Invalid URL for ${social.name}`)
        errored = true;
        return
      }
    })
    if (errored) return;
    const signature = await signOTP();
    const request = fetch('/api/update/link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: "application/json"
      },
      body: JSON.stringify({
        signature,
        publicKey: link.publicKey,
        name: link.name,
        link: link.link,
        description: link.description,
        profilePicture: link.profilePicture,
        background: link.background,
        socials
      })
    })
    toast.promise(
      toasterPromise(request), {
        loading: 'Updating link',
        success: 'Link updated',
        error: 'Please modify a parameter to update this link'
      }
    )
  }


  return (
    <div className={styles.editParent}>

      <div className={styles.editContainer}>
        <div className={styles.defaultFlex}>
          <div>
            <p className={dashStyles.dashboardHeading} style={{ marginBottom: '0.2rem', marginTop: '0rem' }}>Customize Profile</p>
            <p className={dashStyles.dashboardSubHeading} style={{ marginTop: '0.5rem', marginBottom: '0rem' }}>wagmi.bio/{link.link}</p>
          </div>
          <button onClick={handleSubmit}className={defaultStyles.lightBlueBtn}>
            <span><img src={check.src} alt="" /></span>
            PUBLISH
          </button>
        </div>

        <form className={styles.inputContainer}>
          <p className={styles.defaultLabel}>Your Avatar</p>

          <label className="pointer" htmlFor="image-upload">
            <img src={uploadButton.src} alt="" />
          </label>
          <input
            id="image-upload"
            type="file"
            accept=".png, .jpg, .jpeg, .gif"
            onChange={onImageChange}
            style={{ display: 'none' }}
          />

          <p className={styles.defaultLabel}>{"What's your name?"}</p>
          <input onChange={onNameChange} maxLength={18} className={styles.defaultInput} placeholder={'Enter your name'} value={link.name} />

          <p className={styles.defaultLabel}>Write a Bio</p>
          <textarea onChange={onDescriptionChange} maxLength={180} className={styles.textArea} placeholder={'Enter a description'} value={link.description} />

          {socials.map((social: { name: string, link: string }, index: number) => (
            <div key={index}>
              <p className={styles.defaultLabel}>Link {index + 1}</p>
              <div className={defaultStyles.spaceBetweenFlex}>
                <input onChange={(e) => {
                  const newSocials = [...socials]
                  newSocials[index].name = e.target.value
                  setSocials(newSocials)
                }} maxLength={9} className={styles.defaultInput} placeholder={'Enter a name'} style={{ width: '37%' }} value={social.name} />
                <input onChange={(e) => {
                  const newSocials = [...socials]
                  newSocials[index].link = e.target.value
                  setSocials(newSocials)
                }} className={styles.defaultInput} placeholder={'Enter a link'} style={{ width: '60%' }} value={social.link} />
              </div>
            </div>
          ))}

          {socials.length < 8 && (
            <div style={{ marginTop: '1.5rem' }} className={invStyles.addButton} onClick={(e) => {
              e.preventDefault()
              setSocials([...socials, { name: '', link: '' }])
            }}>
              <img src={plus.src} />
              <span>ADD NEW</span>
            </div>
          )}

          <p className={styles.defaultLabel}>Background Gradient</p>
          <div className={styles.gradientGrid}>
            {gradients.map((gradient, index) => (
              <img onClick={() => onBackgroundChange(gradientCount[index])} src={gradient.src} alt="" key={index} />
            ))}
          </div>
        </form>
      </div>

      <div
        style={{
          position: 'fixed',
          top: '3.5rem',
          right: '0',
          width: '40%'
        }}
      >
        <MainScreen
          props={link}
          editLink={true}
        />
      </div>
    </div>
  )
}