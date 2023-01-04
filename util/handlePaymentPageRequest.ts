import {
  validateReservedLink
} from '@/components/ValidateLink'
import {
  getSolDomain
} from '@/util/getSolDomain'

export const handlePaymentPageRequest = async (query: any) => {
  const reserved = validateReservedLink(query.pay)
  const isSolDomain = await resolveSolDomain(query)
  if (isSolDomain) return isSolDomain;
  if (reserved) {
    return {
      props: {
        error: 'Reserved Link'
      }
    }
  } else {
    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://wagmi.bio'
    const user = await fetch(`${baseURL}/api/get/user/${query.pay}`)
    const userData = await user.json()
    const data = await fetch("https://pricing.wagmi.bio/solana");
    const json = data.ok ? await data.json() : null
    const price = json?.price
    if (userData.link) {
      return {
        props: {
          ...userData,
          price: data.ok ? price : 0
        }
      }
    } else {
      return {
        props: {
          error: userData.detail ? userData.detail : 'There was an error fetching this page',
          price: data.ok ? price : 0
        }
      }
    }
  }
}

const returnNotFound = () => {
  return {
    props: {
      error: 'Reserved Link'
    }
  }
}

const resolveSolDomain = async (query: any) => {
  if (query.pay.includes('.sol')) {
    const data = await fetch("https://pricing.wagmi.bio/solana");
    const json = data.ok ? await data.json() : null
    const price = json?.price
    const address = await getSolDomain(query.pay)
    if (address) {
      const solProps = {
        name: query.pay,
        link: query.pay,
        publicKey: address,
        profilePicture: `https://avatars.wagmi.bio/${query.pay}`,
        description: `Hi, I'm ${query.pay} and this is my wagmi link.`,
        background: 'one',
        isConfirmed: true,
        price: data.ok ? price : 0,
      }
      return {
        props: {
          ...solProps
        }
      }
    } else {
      return returnNotFound()
    }
  } else {
    return null
  }
}