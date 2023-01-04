import styles from "@/styles/Home.module.scss"
import defaults from "@/styles/Defaults.module.scss"
import analytics from "@/images/icons/features/analytics.svg"
import commission from "@/images/icons/features/commission.svg"
import embed from "@/images/icons/features/embed.svg"
import international from "@/images/icons/features/international.svg"
import invoicing from "@/images/icons/features/invoicing.svg"
import ramp from "@/images/icons/features/ramp.svg"

const sections = [
  {
    'features': [{
      icon: analytics,
      title: "Analytics",
      description: "Track your payments, and more with our advanced analytics dashboard."
    }, {
      icon: ramp,
      title: "Crypto <> Fiat",
      description: "Get paid in fiat that gets converted to crypto. (Coming Soon)"
    }]
  },
  {
    'features': [{
      icon: commission,
      title: "0% Commission",
      description: "Your funds belong to you, not us."
    }, {
      icon: embed,
      title: "Embed Anywhere",
      description: "Embed wagmi.bio on any website with a single line of code."
    }]
  },
  {
    'features': [{
      icon: invoicing,
      title: "Invoicing",
      description: "Send invoices to your customers, and get paid in crypto."
    }, {
      icon: international,
      title: "International",
      description: "wagmi.bio is the fastest way to receive payments from anyone internationally."
    }]
  }
]

export const Features = () => (
  <>
    <div className={styles.featuresBox}>
      {Object.keys(sections).map((key, index) => (
        <div key={index} className={styles.featuresBoxSection}>
          {sections[index].features.map((feature, i) => (
            <div key={i} className={styles.featuresBoxFeature}>
              <img src={feature.icon.src} alt={feature.title} />
              <div style={{ marginLeft: '1.8rem' }}>
                <span className={defaults.blackText}>{feature.title}</span>
                <p className={defaults.whiteText} style={{ marginTop: '0.25rem' }}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </>
)