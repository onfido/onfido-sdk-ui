import packageJson from '../../package.json'
import { resolve } from 'path'

// Dev only
export const SAFE_SOURCE_MAPS = process.env.SAFE_SOURCE_MAPS ?? false

export const BASE_DIR = resolve(__dirname, '../../')
// We use a Base 32 version string for the cross-device flow, to make URL
// string support easier...
// ref: https://en.wikipedia.org/wiki/Base32
// NOTE: please leave the BASE_32_VERSION be! It is updated automatically by
// the release script 🤖
export const BASE_32_VERSION = 'EA'
export const RELEASE_VERSION = packageJson.version

// NODE_ENV can be one of: development | staging | test | production
export const NODE_ENV = process.env.NODE_ENV || 'production'

// TEST_ENV can be one of: undefined | deployment when NODE_ENV=test
export const TEST_ENV = process.env.TEST_ENV

// For production, test, and staging we should build production ready code
// i.e. fully minified so that testing staging is as realistic as possible
export const PRODUCTION_BUILD = NODE_ENV !== 'development'
export const SDK_TOKEN_FACTORY_SECRET =
  process.env.SDK_TOKEN_FACTORY_SECRET || 'NA'
export const SDK_ENV = process.env.SDK_ENV || 'idv'

type ConstantMap = Record<string, string | boolean | undefined>

const PROD_CONFIG: ConstantMap = {
  ONFIDO_API_URL: 'https://api.onfido.com',
  ONFIDO_SDK_URL: 'https://sdk.onfido.com',
  ONFIDO_TERMS_URL: 'https://onfido.com/termsofuse',
  JWT_FACTORY: 'https://token-factory.onfido.com/sdk_token',
  US_JWT_FACTORY: 'https://token-factory.us.onfido.com/sdk_token',
  CA_JWT_FACTORY: 'https://token-factory.ca.onfido.com/sdk_token',
  DESKTOP_SYNC_URL: 'https://sync.onfido.com',
  MOBILE_URL: 'https://id.onfido.com',
  SMS_DELIVERY_URL: 'https://telephony.onfido.com',
  PUBLIC_PATH: `https://assets.onfido.com/web-sdk-releases/${packageJson.version}/`,
  USER_CONSENT_URL: 'https://assets.onfido.com/consent/user_consent.html',
  COUNTRY_FLAGS_SRC: 'https://assets.onfido.com/flags/',
  RESTRICTED_XDEVICE_FEATURE_ENABLED: true,
  PASSIVE_SIGNALS_URL:
    'https://assets.onfido.com/passive-signals/v1/signal.min.js',
}

const TEST_DEPLOYMENT_CONFIG: ConstantMap = {
  ...PROD_CONFIG,
  PUBLIC_PATH: '/',
  MOBILE_URL: '/',
}

const TEST_E2E_CONFIG: ConstantMap = {
  ...TEST_DEPLOYMENT_CONFIG,
  ONFIDO_API_URL: 'https://localhost:8082/api',
  JWT_FACTORY: 'https://localhost:8082/token-factory/sdk_token',
  US_JWT_FACTORY: 'https://localhost:8082/token-factory/sdk_token',
  CA_JWT_FACTORY: 'https://localhost:8082/token-factory/sdk_token',
  SMS_DELIVERY_URL: 'https://localhost:8080/telephony',
  RESTRICTED_XDEVICE_FEATURE_ENABLED: false,
}

const STAGING_CONFIG: ConstantMap = {
  ONFIDO_API_URL: 'https://api.eu-west-1.dev.onfido.xyz',
  ONFIDO_SDK_URL: 'https://mobile-sdk.eu-west-1.dev.onfido.xyz',
  ONFIDO_TERMS_URL: 'https://dev.onfido.com/termsofuse',
  JWT_FACTORY: 'https://sdk-token-factory.eu-west-1.dev.onfido.xyz/sdk_token',
  US_JWT_FACTORY:
    'https://sdk-token-factory.eu-west-1.dev.onfido.xyz/sdk_token',
  CA_JWT_FACTORY:
    'https://sdk-token-factory.eu-west-1.dev.onfido.xyz/sdk_token',
  DESKTOP_SYNC_URL: 'https://cross-device-sync.eu-west-1.dev.onfido.xyz',
  MOBILE_URL: '/',
  SMS_DELIVERY_URL: 'https://telephony.eu-west-1.dev.onfido.xyz',
  PUBLIC_PATH: '/',
  USER_CONSENT_URL: 'https://assets.onfido.com/consent/user_consent.html',
  COUNTRY_FLAGS_SRC: 'https://assets.onfido.com/flags/',
  RESTRICTED_XDEVICE_FEATURE_ENABLED: false,
  PASSIVE_SIGNALS_URL:
    'https://assets.onfido.com/dev/passive-signals/v1/signal.min.js',

  // @TODO: clean-up this config when v4 APIs are live
  USE_V4_APIS_FOR_DOC_VIDEO: process.env.USE_V4_APIS_FOR_DOC_VIDEO,
}

const DEVELOPMENT_CONFIG: ConstantMap = {
  ...PROD_CONFIG,
  PUBLIC_PATH: '/',
  MOBILE_URL: '/',
  RESTRICTED_XDEVICE_FEATURE_ENABLED: false,
}

const CONFIG_MAP: Record<string, ConstantMap> = {
  development: DEVELOPMENT_CONFIG,
  staging: STAGING_CONFIG,
  test: TEST_ENV === 'deployment' ? TEST_DEPLOYMENT_CONFIG : TEST_E2E_CONFIG,
  production: PROD_CONFIG,
}

export const CONFIG = CONFIG_MAP[NODE_ENV]
