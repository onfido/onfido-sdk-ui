export const getTestJwtToken = async () => {
  return new Promise((resolve, reject) => {
    const secret = process.env.SDK_TOKEN_FACTORY_SECRET

    if (!secret) {
      return reject('Secret not defined')
    }

    const tokenFactoryUrl = 'https://token-factory.onfido.com/sdk_token' // EU region
    const xhr = new XMLHttpRequest()
    xhr.open('GET', tokenFactoryUrl, true)
    xhr.setRequestHeader('Authorization', `BASIC ${secret}`)
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 400) {
        const data = JSON.parse(xhr.responseText)
        resolve(data.message)
      } else {
        reject(xhr.responseText)
      }
    }
    xhr.send()
  })
}

export const createEmptyFile = (
  testFileName = 'empty_file.jpg',
  mimeType = 'image/jpeg'
) =>
  new File([], testFileName, {
    type: mimeType,
  })

export const COMMON_FILE_UPLOAD_PROPERTIES = [
  'created_at',
  'download_href',
  'href',
  'file_size',
  'id',
]

export const checkForExpectedFileUploadProperties = (
  expectedProperties,
  response
) => {
  expectedProperties.forEach((expectedProperty) => {
    if (typeof expectedProperty === 'object') {
      const keys = Object.keys(expectedProperty)
      keys.forEach((key) =>
        expect(response).toHaveProperty(key, expectedProperty[key])
      )
    } else {
      expect(response).toHaveProperty(expectedProperty)
    }
  })
}
