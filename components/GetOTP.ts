export const getOTP = async (publicKey: string) => {
  const otpRequest: any = await fetch('/api/otp', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      publicKey,
    }),
  }).catch((error) => {
    console.error(error);
  });
  const data = await otpRequest.json();
  if (data.otp) {
    return data.otp;
  }
};
