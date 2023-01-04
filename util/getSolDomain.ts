import { PublicKey, Connection } from '@solana/web3.js';
import { getHashedName, getNameAccountKey, NameRegistryState } from '@solana/spl-name-service'

export const SOL_TLD_AUTHORITY = new PublicKey(
    "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

export const resolveDomainName = async (
  connection: Connection,
  domainName: string,
): Promise<string | undefined> => {
  let hashedDomainName = await getHashedName(domainName);
  let inputDomainKey = await getNameAccountKey(
    hashedDomainName,
    undefined,
    SOL_TLD_AUTHORITY,
  );
  try {
    const registry = await NameRegistryState.retrieve(
      connection,
      inputDomainKey,
    );
    return registry.owner.toBase58();
  } catch (err) {
    return undefined;
  }
};

export const getSolDomain = async (domain: string) => {
    const solDomain = domain.replace('.sol', '');
    const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake')
    const address = await resolveDomainName(connection, solDomain);
    return address ? address : undefined;
}