/* eslint-disable no-duplicate-imports */
import { Router, Status } from './deps.ts'
import type { FormDataBody } from './deps.ts'

import { generateToken } from './jwt.ts'
import responses from './responses.ts'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const applicantId = '742af521-2c8f-4b54-a8b7-01c962849d5b'

/**
 * This helper is to match against uploaded files
 * instead of using switch-case
 * because IE11 on Windows submit files in a weird format
 * e.g: C:Windowsproxyd0bd7093-f21a-4579-8707-f7aabd4948c2upload4900467381210572080filepassport.jpg
 */
const matchUploadedFile = (
  uploadedFileName: string,
  matchFileNames: string[]
): boolean => {
  const regex = new RegExp(`(${matchFileNames.join('|')})$`)
  return uploadedFileName.match(regex) != null
}

const buildDocumentsResponse = (
  formData: FormDataBody
): { body: Record<string, unknown>; status: Status } | undefined => {
  if (!formData.files || !formData.files.length) {
    return
  }

  const [{ originalName }] = formData.files
  console.log('Uploaded file:', originalName)

  if (
    matchUploadedFile(originalName, [
      'driving_licence.png',
      'uk_driving_licence.png',
    ])
  ) {
    return {
      body: Object.assign(responses.api.v3.documents.driving_licence_front, {
        applicant_id: applicantId,
      }),
      status: Status.OK,
    }
  }

  if (
    matchUploadedFile(originalName, [
      'back_driving_licence.jpg',
      'back_driving_licence.png',
    ])
  ) {
    return {
      body: Object.assign(responses.api.v3.documents.driving_licence_back, {
        applicant_id: applicantId,
      }),
      status: Status.OK,
    }
  }

  if (
    matchUploadedFile(originalName, [
      'identity_card_with_cut-off.png',
      'identity_card_with_cut-off_glare.png',
    ])
  ) {
    return {
      body: Object.assign(responses.api.v3.documents.cutoff, {
        applicant_id: applicantId,
      }),
      status: Status.UnprocessableEntity,
    }
  }

  if (matchUploadedFile(originalName, ['identity_card_with_glare.jpg'])) {
    return {
      body: Object.assign(responses.api.v3.documents.glare, {
        applicant_id: applicantId,
      }),
      status: Status.OK,
    }
  }

  if (
    matchUploadedFile(originalName, [
      'national_identity_card.jpg',
      'national_identity_card.pdf',
    ])
  ) {
    return {
      body: Object.assign(responses.api.v3.documents.id_card, {
        applicant_id: applicantId,
      }),
      status: Status.OK,
    }
  }

  if (matchUploadedFile(originalName, ['passport.jpg', 'passport.pdf'])) {
    return {
      body: Object.assign(responses.api.v3.documents.passport, {
        applicant_id: applicantId,
        file_name: originalName,
      }),
      status: Status.OK,
    }
  }

  if (originalName === 'blob' || originalName === 'document_capture.jpeg') {
    const { type, sdk_metadata } = formData.fields
    const sdkMetadata = JSON.parse(sdk_metadata)

    if (type === 'passport' && sdkMetadata.imageResizeInfo) {
      return {
        body: Object.assign(responses.api.v3.documents.glare, {
          applicant_id: applicantId,
        }),
        status: Status.OK,
      }
    }
  }

  return {
    body: Object.assign(responses.api.v3.documents.no_doc, {
      applicant_id: applicantId,
    }),
    status: Status.UnprocessableEntity,
  }
}

const buildLivePhotosResponse = (
  formData: FormDataBody
): { body: Record<string, unknown>; status: Status } | undefined => {
  if (!formData.files || !formData.files.length) {
    return
  }

  const [{ originalName }] = formData.files
  console.log('Uploaded file:', originalName)

  if (matchUploadedFile(originalName, ['face.jpeg', 'applicant_selfie.png'])) {
    return {
      body: responses.api.v3.live_photos.face,
      status: Status.OK,
    }
  }

  if (matchUploadedFile(originalName, ['llama.jpg'])) {
    return {
      body: responses.api.v3.live_photos.no_face,
      status: Status.UnprocessableEntity,
    }
  }

  if (matchUploadedFile(originalName, ['two_faces.jpg'])) {
    return {
      body: responses.api.v3.live_photos.multiple_face,
      status: Status.UnprocessableEntity,
    }
  }

  if (originalName === 'blob') {
    const { sdk_metadata } = formData.fields
    const sdkMetadata = JSON.parse(sdk_metadata)

    if (sdkMetadata.imageResizeInfo) {
      return {
        body: responses.api.v3.live_photos.face,
        status: Status.OK,
      }
    }
  }

  return {
    body: responses.api.v3.live_photos.unsupported,
    status: Status.UnprocessableEntity,
  }
}

const tokenFactoryRouter = new Router({ prefix: '/token-factory' })
tokenFactoryRouter.get('/sdk_token', async (context) => {
  context.response.body = {
    applicant_id: applicantId,
    message: await generateToken(context),
  }
})

const telephonyRouter = new Router({ prefix: '/telephony' })
telephonyRouter.post('/v1/cross_device_sms', (context) => {
  context.response.body = responses.telephony.v1.cross_device_sms
})

const apiRouter = new Router({ prefix: '/api' })
apiRouter
  .get('/ping', (context) => {
    context.response.body = { message: 'pong' }
  })
  .post('/v3.3/sdk/configurations', async (context) => {
    context.response.body = responses.api.v3.sdk_configurations
    context.response.status = Status.OK
  })
  .post('/v3/analytics', async (context) => {
    context.response.body = { message: 'success' }
    context.response.status = Status.OK
  })
  .post('/v3/documents', async (context) => {
    try {
      const body = context.request.body({ type: 'form-data' })
      const formData = await body.value.read()

      console.log('formData.fields:', formData.fields)
      console.log('formData.files:', formData.files)

      const responseData = buildDocumentsResponse(formData)

      if (responseData) {
        Object.assign(context.response, responseData)
      } else {
        context.response.body = { message: 'Unsupported mock' }
        context.response.status = Status.BadRequest
      }
    } catch (error) {
      console.log('error:', error)
      context.throw(Status.UnprocessableEntity, error.message)
    }
  })
  .post('/v3/live_photos', async (context) => {
    const body = context.request.body({ type: 'form-data' })
    const formData = await body.value.read()
    const responseData = buildLivePhotosResponse(formData)

    if (responseData) {
      Object.assign(context.response, responseData)
    } else {
      context.response.body = { message: 'Unsupported mock' }
      context.response.status = Status.BadRequest
    }
  })
  .post('/v3/live_video_challenge', (context) => {
    context.response.body = responses.api.v3.live_video_challenge
  })
  .post('/v3/live_videos', (context) => {
    context.response.body = responses.api.v3.live_videos
  })
  .post('/v3/snapshots', (context) => {
    context.response.body = responses.api.v3.snapshots
  })
  .post('/v4/binary_media', async (context) => {
    await sleep(500)
    const isVideo = context.request.headers.get('x-video-auth') != null

    context.response.body = isVideo
      ? responses.api.v4.binary_media.video
      : responses.api.v4.binary_media.image
  })
  .post('/v4/documents', async (context) => {
    await sleep(500)
    context.response.body = responses.api.v4.documents
  })

export { apiRouter, telephonyRouter, tokenFactoryRouter }
