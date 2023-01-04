import { useState, useEffect } from 'react'
import dashStyles from '@/styles/Dashboard.module.scss'
import { Loading } from '@/layouts/Loading'

type Props = {
  error: string,
  loading: boolean
}

export const InfoMessage = ({ error, loading }: Props) => {
  const [init, setInit] = useState(false)

  useEffect(() => {
    setTimeout(() => setInit(true), 2000)
  }, [setInit])

  return (
    <>
      {(error || loading) && (
        <div className={dashStyles.infoMessages}>
          {(!init || loading) && (
            <>
              <p className={dashStyles.dashInfo}>Loading...</p>
              <Loading size={100} />
            </>
          )}
          {error && init && !loading && (
            <>
              <p className={dashStyles.dashInfo}>{error}</p>
            </>
          )}
        </div>
      )}
    </>
  )
}