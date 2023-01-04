import styles from '@/styles/Dashboard.module.scss'
import chartOne from '@/images/icons/chart-1.svg'
import chartTwo from '@/images/icons/chart-2.svg'
import chartThree from '@/images/icons/chart-3.svg'
import chartFour from '@/images/icons/chart-4.svg';
import ArrowIcon from '@/dynamic/Arrow';
import WSStyles from '@/styles/WSPayment.module.scss';


export const VisitsBox = ({ visits }: { visits: number }) => (
  <div className={styles.chartsBox}>
    <img alt="" src={chartTwo.src} />
    <div className={styles.chartInfo}>
      <p className={styles.chartHeading}>Total Visits</p>
      <p className={styles.chartNumbers}>{visits > 0 ? visits.toLocaleString(undefined, { 'minimumFractionDigits': 0,'maximumFractionDigits': 0 }) : 0}</p>
    </div>
  </div>
)

export const RevenueBox = ({ revenue }: { revenue: number }) => (
  <div className={styles.chartsBox}>
    <img alt="" src={chartOne.src} />
    <div className={styles.chartInfo}>
      <p className={styles.chartHeading}>Total Revenue</p>
      <p className={styles.chartNumbers}>${revenue > 0 ? revenue.toLocaleString(undefined, { 'minimumFractionDigits': 2,'maximumFractionDigits': 2 }) : '0.00'}</p>
    </div>
  </div>
)

export const TotalInvoices = ({ invoices }: { invoices: number }) => (
  <div className={styles.chartsBox}>
    <img alt="" src={chartFour.src} />
    <div className={styles.chartInfo}>
      <p className={styles.chartHeading}>Total Invoices</p>
      <p className={styles.chartNumbers}>{invoices}</p>
    </div>
  </div>
)

export const TotalLinks = ({ links }: { links: number }) => (
  <div className={styles.chartsBox}>
    <img alt="" src={chartThree.src} />
    <div className={styles.chartInfo}>
      <p className={styles.chartHeading}>Total Links</p>
      <p className={styles.chartNumbers}>{links}</p>
    </div>
  </div>
)

export const PaymentButton = ({
  onClick,
  icon,
  text,
  bgColor,
  textColor,
}: {
  onClick: () => void
  icon: string,
  text: string,
  bgColor: string,
  textColor: string
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${WSStyles.payWithbtn}
        ${WSStyles.payWithbtnFlex}
      `}
      style={{
        backgroundColor: bgColor
      }}
    >
      <img
        className={WSStyles.payWithbtnIcon}
        src={icon}
        alt=""
      />
      <p
        style={{ color: textColor }}
        className={WSStyles.payWithbtnText}
      >
        {text}
      </p>
    </div>
  )
};

export const RequestButton = ({
  setRPayModalIsOpen
}: {
  setRPayModalIsOpen: (isOpen: boolean) => void
}) => {
  return (
    <div
      onClick={() => setRPayModalIsOpen(true)}
      className={WSStyles.requestBtn}
    >
      <div className={WSStyles.requestBtnArrow}>
        <ArrowIcon />
      </div>
      <p className={WSStyles.requestText}>Request</p>
    </div>
  )
}