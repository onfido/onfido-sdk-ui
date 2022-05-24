import { useEffect, useState, FunctionComponent } from 'react'
import * as Onfido from 'onfido-sdk-ui'

const getToken = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = 'https://token-factory.onfido.com/sdk_token'

    const onRequestError = (request: XMLHttpRequest) => {
      const error = new Error(`Request failed with status ${request.status}`)
      Object.assign(error, { request })
      reject(error)
    }

    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.setRequestHeader(
      'Authorization',
      `BASIC ${process.env.REACT_APP_SDK_TOKEN_FACTORY_SECRET}`
    )
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const data = JSON.parse(request.responseText)
        resolve(data.message)
      } else {
        onRequestError(request)
      }
    }
    request.onerror = () => onRequestError(request)
    request.send()
  })

const App: FunctionComponent = () => {
  const [loading, setLoading] = useState(false)
  const [onfidoInstance, setOnfidoInstance] = useState<Onfido.SdkHandle | null>(
    null
  )

  const initOnfido = async () => {
    try {
      setLoading(true)
      const token = await getToken()

      const instance = Onfido.init({
        useModal: false,
        token,
        onComplete: (data) => {
          // callback for when everything is complete
          console.log('Everything is complete', data)
        },
        steps: [
          {
            type: 'welcome',
            options: {
              title: 'Open your new bank account',
            },
          },
          'document',
          'face',
          'complete',
        ],
      })

      setOnfidoInstance(instance)
      setLoading(false)
    } catch (err) {
      console.log('err:', err.message, err.request)
    }
  }

  useEffect(() => {
    initOnfido()
    return () => {
      console.log('tear down', onfidoInstance)
      onfidoInstance && onfidoInstance.tearDown()
    }
  }, [])

  return <div id="onfido-mount">{loading && <div>Loading...</div>}</div>
}

export default App
