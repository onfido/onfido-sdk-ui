/* eslint-disable no-duplicate-imports */
import { create, getNumericDate } from './deps.ts'
import type { Header } from './deps.ts'

const EXP_IN_SECONDS = 60 * 60 // 60 minutes

const payload = {
  exp: getNumericDate(EXP_IN_SECONDS),
  payload:
    'TeING9+F5TB8waiN7l94SI9chwJppCYTaxTqqOdJzilmKSxh2jqsbaZ2BJoe\naR/0PhrfPUvWG2inSeLTC5M+Rg==\n',
  uuid: 'iwokFVedG18',
  enterprise_features: {
    cobrand: true,
    hideOnfidoLogo: true,
    logoCobrand: true,
    useCustomizedApiRequests: true,
  },
  urls: {
    telephony_url: 'https://localhost:8080/telephony',
    detect_document_url: 'https://localhost:8080/sdk',
    sync_url: 'https://sync.onfido.com',
    hosted_sdk_url: 'https://id.onfido.com',
    auth_url: 'https://edge.api.onfido.com',
    onfido_api_url: 'https://localhost:8080/api',
  },
}

const header: Header = {
  alg: 'HS256',
}

export const generateToken = () => create(header, payload, '')
