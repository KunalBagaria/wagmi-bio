type data = {
  signature: string,
  from: string,
  link: string,
  amount: number,
  amountInUSD?: number,
  createdAt?: Date,
  message?: string,
  token: string
}

export const incrementRevenue = (data: data) => {
  fetch('/api/pay', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};