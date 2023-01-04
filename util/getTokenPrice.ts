export const getTokenPrice = async (token: string) => {
    const response = await fetch(`https://pricing.wagmi.bio/${token}`);
    const data = await response.json();
    console.log(data)
    return data.price;
}