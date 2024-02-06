const getToken = async () => {
  const response = await fetch('https://token-factory.onfido.com/sdk_token');
  if (!response.ok) {
    throw new Error('Failed to get sdk token');
  }

  return (await response.json()).message;
}

async function bootstrapSdk() {

  Onfido.init({
    useModal: false,
    token: await getToken(),
    onComplete: (data) => {
      console.log('completed', data);
    },
    onError: console.error,
    steps: ['welcome', 'document', 'face', 'complete'],
  });
}

bootstrapSdk().catch(console.error);
