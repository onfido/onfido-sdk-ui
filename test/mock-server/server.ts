import {
  Application,
  FormDataBody,
  Router,
  Status,
} from 'https://deno.land/x/oak/mod.ts'
import { oakCors } from 'https://deno.land/x/cors/mod.ts'

import { generateToken } from './jwt.ts'
import responses from './responses.ts'

const applicantId = '742af521-2c8f-4b54-a8b7-01c962849d5b'

const buildDocumentsResponse = (
  formData: FormDataBody
): { body: object; status: Status } | undefined => {
  if (!formData.files || !formData.files.length) {
    return
  }

  const [{ originalName }] = formData.files

  switch (originalName) {
    case 'driving_licence.png':
    case 'uk_driving_licence.png':
      return {
        body: Object.assign(responses.api.v3.documents.driving_licence_front, {
          applicant_id: applicantId,
        }),
        status: Status.OK,
      }
    case 'back_driving_licence.jpg':
    case 'back_driving_licence.png':
      return {
        body: Object.assign(responses.api.v3.documents.driving_licence_back, {
          applicant_id: applicantId,
        }),
        status: Status.OK,
      }
    case 'identity_card_with_cut-off.png':
    case 'identity_card_with_cut-off_glare.png':
      return {
        body: Object.assign(responses.api.v3.documents.cut_off, {
          applicant_id: applicantId,
        }),
        status: Status.OK,
      }
    case 'identity_card_with_glare.jpg':
      return {
        body: Object.assign(responses.api.v3.documents.glare, {
          applicant_id: applicantId,
        }),
        status: Status.OK,
      }
    case 'national_identity_card.jpg':
    case 'national_identity_card.pdf':
      return {
        body: Object.assign(responses.api.v3.documents.id_card, {
          applicant_id: applicantId,
        }),
        status: Status.OK,
      }
    case 'passport.jpg':
    case 'passport.pdf':
      return {
        body: Object.assign(responses.api.v3.documents.passport, {
          applicant_id: applicantId,
          file_name: originalName,
        }),
        status: Status.OK,
      }
    case 'face.jpeg':
    case 'llama.pdf':
    default:
      return {
        body: Object.assign(responses.api.v3.documents.no_doc, {
          applicant_id: applicantId,
        }),
        status: Status.UnprocessableEntity,
      }
  }
}

const buildLivePhotosResponse = (
  formData: FormDataBody
): { body: object; status: Status } | undefined => {
  if (!formData.files || !formData.files.length) {
    return
  }

  const [{ originalName }] = formData.files

  switch (originalName) {
    case 'face.jpeg':
      return {
        body: responses.api.v3.live_photos.face,
        status: Status.OK,
      }
    default:
      return {
        body: responses.api.v3.live_photos.unsupported,
        status: Status.UnprocessableEntity,
      }
  }
}

const router = new Router()
router
  .get('/ping', (context) => {
    context.response.body = { message: 'pong' }
  })
  .get('/token-factory/sdk_token', async (context) => {
    context.response.body = {
      applicant_id: applicantId,
      message: await generateToken(),
    }
  })
  .post('/telephony/v1/cross_device_sms', (context) => {
    context.response.body = responses.telephony.v1.cross_device_sms
  })
  .post('/api/v3/documents', async (context) => {
    try {
      const body = context.request.body({ type: 'form-data' })
      const formData = await body.value.read()

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
  .post('/api/v3/live_photos', async (context) => {
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
  .post('/api/v3/live_video_challenge', (context) => {
    context.response.body = responses.api.v3.live_video_challenge
  })
  .post('/api/v3/live_videos', (context) => {
    context.response.body = responses.api.v3.live_videos
  })
  .post('/api/v3/snapshots', (context) => {
    context.response.body = responses.api.v3.snapshots
  })

const app = new Application()

// Logger
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start

  console.group('\n----------')
  console.log(`[REQUEST] ${ctx.request.method} ${ctx.request.url} - ${ms}ms`)
  console.log(
    `[RESPONSE] ${ctx.response.status} ${JSON.stringify(
      ctx.response.body,
      null,
      2
    )}`
  )
  console.groupEnd()
})

app.use(oakCors())
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8081 })
