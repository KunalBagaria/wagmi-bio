/** @type {import('next').NextConfig} */

const securityHeaders = [{
	key: 'X-Frame-Options',
	value: 'SAMEORIGIN'
}]

module.exports = {
	reactStrictMode: true,
	async headers() {
		return [{
			source: '/:pay',
			headers: securityHeaders,
		}, ]
	},
  async redirects() {
    return [
      {
        source: '/challenge',
        destination: 'https://bafybeifm3xpooj5s62kknijjqnbbsr55zacu6jleiqc7inkxyssalwxtam.ipfs.nftstorage.link/',
        permanent: true,
      },
    ]
  },
}