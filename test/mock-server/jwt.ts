import { Header, create, getNumericDate } from 'https://deno.land/x/djwt/mod.ts'

const EXP_IN_SECONDS = 60 * 60 // 60 minutes

const payload = {
  exp: getNumericDate(EXP_IN_SECONDS),
  payload:
    'TeING9+F5TB8waiN7l94SI9chwJppCYTaxTqqOdJzilmKSxh2jqsbaZ2BJoe\naR/0PhrfPUvWG2inSeLTC5M+Rg==\n',
  uuid: 'iwokFVedG18',
  enterprise_features: {
    cobrand: true,
    hideOnfidoLogo: true,
  },
  urls: {
    telephony_url: 'http://localhost:8081/telephony',
    detect_document_url: 'http://localhost:8081/sdk',
    sync_url: 'http://localhost:8081/sync',
    hosted_sdk_url: 'https://id.onfido.com',
    auth_url: 'https://edge.api.onfido.com',
    onfido_api_url: 'http://localhost:8081/api',
  },
}

const header: Header = {
  alg: 'HS256',
}

export const generateToken = () => create(header, payload, '')
