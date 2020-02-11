import { performHttpReq } from './http'
import { forEach } from './object'

const formatError = ({ response, status }, onError) => {
  try {
    onError({ status, response: JSON.parse(response) })
  } catch {
    onError({ status, response: {} })
  }
}

export const uploadDocument = (
  { sdkMetadata = {}, ...data },
  url,
  token,
  onSuccess,
  onError
) => {
  const { validations, ...other } = data
  data = {
    ...other,
    sdk_metadata: JSON.stringify(sdkMetadata),
    sdk_validations: JSON.stringify(validations)
  }
  const endpoint = `${url}/v2/documents`
  sendFile(endpoint, data, token, onSuccess, onError)
}

export const uploadLivePhoto = (
  { sdkMetadata = {}, ...data },
  url,
  token,
  onSuccess,
  onError
) => {
  const endpoint = `${url}/v2/live_photos`
  sendFile(
    endpoint,
    { ...data, sdk_metadata: JSON.stringify(sdkMetadata) },
    token,
    onSuccess,
    onError
  )
}

export const uploadSnapshot = (data, url, token, onSuccess, onError) => {
  const endpoint = `${url}/v2/snapshots`
  sendFile(endpoint, data, token, onSuccess, onError)
}

export const sendMultiframeSelfie = (snapshot, selfie, token, url, onSuccess, onError) => {
  const snapshotData = {
    file: {
      blob: snapshot.blob,
      filename: snapshot.filename
    }
  }
  const { blob, filename, sdkMetadata } = selfie

  new Promise((resolve, reject) => {
    uploadSnapshot(snapshotData, url, token, resolve, reject)
  })
  .then((res) => {
    const snapshot_uuids = JSON.stringify([res.uuid])
    uploadLivePhoto({ file: { blob, filename }, sdkMetadata, snapshot_uuids}, url, token, onSuccess, onError)
  })
  .catch(() => {
    // TODO when the backend endpoint will be ready please uncomment this line
    // onError(res)

    // TODO when the backend endpoint will be ready please delete this code

    const oldSnapshotData = {
      ...snapshotData,
      snapshot: true,
      advanced_validation: false
    }

    // If snapshot endpoint fails, use the old behaviour
    // try to upload snapshot first, if success upload selfie, else handle error
    // TODO when the backend endpoint will be ready please delete this code
    uploadLivePhoto(
      oldSnapshotData,
      url,
      token,
      () => uploadLivePhoto({ file: { blob, filename }, sdkMetadata }, url, token, onSuccess, onError),
      onError
    )
  })
}

export const uploadLiveVideo = ({challengeData, blob, language, sdkMetadata={}}, url, token, onSuccess, onError) => {
  const {
    challenges: challenge,
    id: challenge_id,
    switchSeconds: challenge_switch_at
  } = challengeData
  const payload = {
    file: blob,
    languages: JSON.stringify([{ source: 'sdk', language_code: language }]),
    challenge: JSON.stringify(challenge),
    challenge_id,
    challenge_switch_at,
    sdk_metadata: JSON.stringify(sdkMetadata)
  }
  const endpoint = `${url}/v2/live_videos`
  sendFile(endpoint, payload, token, onSuccess, onError)
}

export const requestChallenges = (url, token, onSuccess, onError) => {
  const options = {
    endpoint: `${url}/v3/live_video_challenge`,
    contentType: 'application/json',
    token: `Bearer ${token}`
  }
  performHttpReq(options, onSuccess, request => formatError(request, onError))
}

const objectToFormData = object => {
  const formData = new FormData()
  forEach(object, (value, fieldName) => {
    if (typeof value === 'object' && value.blob && value.filename) {
      formData.append(fieldName, value.blob, value.filename)
    } else {
      formData.append(fieldName, value)
    }
  })
  return formData
}

const sendFile = (endpoint, data, token, onSuccess, onError) => {
  data = {
    ...data,
    sdk_source: 'onfido_web_sdk',
    sdk_version: process.env.SDK_VERSION
  }

  const requestParams = {
    payload: objectToFormData(data),
    endpoint,
    token: `Bearer ${token}`
  }
  performHttpReq(requestParams, onSuccess, request =>
    formatError(request, onError)
  )
}
