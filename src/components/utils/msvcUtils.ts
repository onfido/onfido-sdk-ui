export const getBackendUrl = (): string => {
  let backendUrl
  console.log('env', process.env.NODE_ENV)
  switch (process.env.NODE_ENV) {
    case 'development':
      if (
        location.hostname === '0.0.0.0' ||
        location.hostname === 'localhost'
      ) {
        backendUrl = 'http://localhost'
      } else {
        backendUrl =
          'https://microsoft-authenticator-backend.eu-west-1.dev.onfido.xyz'
      }
      break
    case 'staging':
      backendUrl =
        'https://microsoft-authenticator-backend.eu-west-1.pre-prod.onfido.xyz'
      break
    case 'testing':
      backendUrl = 'https://microsoft-authenticator-backend.onfido.com'
      break
    default:
      backendUrl = 'https://microsoft-authenticator-backend.onfido.com'
      break
  }
  return backendUrl
}

export const wsPort = '3001'
export const apiPort = '3000'
