/* eslint-disable no-duplicate-imports */
import { create, getNumericDate } from './deps.ts'
import type { Header } from './deps.ts'

const EXP_IN_SECONDS = 60 * 60 // 60 minutes

const header: Header = {
  alg: 'HS256',
}

export const generateToken = async (context: any) => {
  const origin =
    context.request.url.searchParams.get('origin') || context.request.url.origin

  const payload = {
    exp: getNumericDate(EXP_IN_SECONDS),
    payload: {
      app: 'ebbad7e0-5f3c-4a6e-bf96-fa65c172d12c',
      client_uuid: 'ce69f18f-8006-423d-afda-fcaff0de2154',
      is_trial: false,
      is_sandbox: false,
      ref: '*://*/*',
      sardine_session: '1207fcd6-e76b-463d-b84a-fbcd17cf6f54',
    },
    uuid: 'iwokFVedG18',
    enterprise_features: {
      cobrand: true,
      hideOnfidoLogo: true,
      logoCobrand: true,
      useCustomizedApiRequests: true,
    },
    urls: {
      telephony_url: `${origin}/telephony`,
      detect_document_url: `${origin}/sdk`,
      sync_url: 'https://sync.onfido.com',
      hosted_sdk_url: 'https://id.onfido.com',
      auth_url: 'https://edge.api.onfido.com',
      onfido_api_url: `${origin}/api`,
    },
  }

  const key = await crypto.subtle.generateKey(
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  )

  return create(header, payload, key)
}
