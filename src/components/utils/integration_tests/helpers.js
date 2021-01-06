export const getTestJwtToken = (resolve) => {
  const tokenFactoryUrl = 'https://token-factory.onfido.com/sdk_token' // EU region
  const request = new XMLHttpRequest()
  request.open('GET', tokenFactoryUrl, true)
  request.setRequestHeader(
    'Authorization',
    `BASIC ${process.env.SDK_TOKEN_FACTORY_SECRET}`
  )
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText)
      return resolve(data.message)
    }
  }
  request.send()
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
