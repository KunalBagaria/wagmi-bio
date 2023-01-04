import { NFTStorage } from 'nft.storage';

export const uploadFile = async (image: File) => {
  const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3NmI0N0ZlQUNlRDEzOTIyMTZBMzkwZmE4Yjg0RWI0MzYxN2M1NzAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNzM0Njg3MjE1NCwibmFtZSI6IndhZ21pLmJpbyJ9.o3mHPTFPLgTGgxrWvw4WtYG8zJsgGvjgiR-M_l9I6SY' });
  console.log(`Uploading image: ${image.name}`);
  const metadata = await client.store({
    name: 'My sweet avatar',
    description: 'wagmi.bio',
    image,
  });
  const rawURL = metadata.embed().image;
  const masala = rawURL.toString().split('/ipfs/')[1];
  const imageURL = `https://ipfs.io/ipfs/${masala}`;
  console.log(`🎉 Uploaded image: ${imageURL}`);
  return imageURL;
};