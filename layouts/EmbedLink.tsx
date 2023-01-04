import styles from '@/styles/EmbedLink.module.scss'
import dashStyles from '@/styles/Dashboard.module.scss'
import expandIcon from '@/images/icons/expand.svg'
import ClickAwayListener from 'react-click-away-listener'
// @ts-ignore
import { CopyBlock, monoBlue } from "react-code-blocks";
import { useState } from 'react'

type Props = {
  links: any
}

export const EmbedLink = ({ links }: Props) => {
  const handleChange = (event: any) => {
    const linkSelected = event.target.value
    if (!linkSelected) return
    setSelectedLink(linkSelected)
  }

  const [selectedLink, setSelectedLink] = useState(links[0].link)
  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(600)
  const [expanded, setExpanded] = useState(false)

  const code = `<iframe
  id="wagmi"
  src="https://wagmi.bio/embed/${selectedLink}"
  style="outline:none;border:none;
  border-radius:1rem;
  width:${width/16}rem;height:${height/16}rem"
></iframe>`

  return (
    <div className={styles.container}>
      <div className={styles.codeContainer}>
        <p className={dashStyles.dashboardHeading}>Embed your link</p>
        <p className={dashStyles.dashboardSubHeading}>Use wagmi on other websites</p>
        <div className={styles.customizeContainer}>
          <p>Link</p>

          <ClickAwayListener onClickAway={() => setExpanded(false)}>
            <div style={{ width: '100%' }}>
              <div onClick={() => setExpanded(!expanded)} className={styles.linkSelector} style={{ outline: expanded ? '0.1rem solid rgba(55, 123, 255, 0.41)' : '0.1rem solid #A4B3C0' }}>
                <p>wagmi.bio/{selectedLink}</p>
                <img style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.1s linear' }} src={expandIcon.src} />
              </div>
              <div className={styles.expandedContainer} style={{ display: expanded ? 'flex' : 'none' }}>
                {links.map((link: any, index: any) => (
                  <div onClick={() => {
                    setSelectedLink(links[index].link)
                    setExpanded(false)
                  }} style={{ background: link.link === selectedLink ? 'rgba(55, 123, 255, 0.13)' : '' }} key={index}>
                    <p>wagmi.bio/{link.link}</p>
                  </div>
                ))}
              </div>
            </div>
          </ClickAwayListener>

          <p style={{ marginTop: '1rem', marginBottom: '0rem' }}>Size</p>

          <div className={styles.dimensions}>
            <div className={styles.dimensionInput}>
              <input type="number" onChange={(e) => setWidth(Number(e.target.value))} id="width" placeholder={'Width'} />
              <label htmlFor="width">px</label>
            </div>

            <div className={styles.dimensionInput}>
              <input type="number" onChange={(e) => setHeight(Number(e.target.value))} id="height" placeholder={'Height'} />
              <label htmlFor="height">px</label>
            </div>
          </div>

        </div>
        <CopyBlock codeBlock text={code} language={'html'} showLineNumbers={true} wrapLines={true} theme={monoBlue} />
      </div>

      <div>
        <p className={dashStyles.dashboardTagLabel} style={{ marginTop: '0rem' }}>Preview</p>
        <div className={styles.iframeContainer}>
          <iframe
            src={`/embed/${selectedLink}`}
            style={{
              outline: 'none',
              border: 'none',
              borderRadius: '1rem',
              width: (width/16) + 'rem',
              height: (height/16) + 'rem',
              overflow: 'hidden'
            }}
          ></iframe>
        </div>
      </div>

    </div>
  )
}