import { SdkOptions } from '~types/sdk'

// See https://docs.google.com/spreadsheets/d/1uTsCgydn4_zeNTWuRcbd4UkcXGHcsjMCM2g88HcMSBU/edit#gid=594602246
const testCases: { [x: string]: SdkOptions } = {
  'TC-20': {
    language: {
      locale: 'fr',
      phrases: { 'welcome.title': 'Ouvrez votre nouveau compte bancaire' },
    },
  },
  'TC-21': {
    language: {
      locale: 'es',
      phrases: { 'welcome.title': 'A custom string' },
    },
  },
  'TC-22': {
    language: {
      locale: 'es',
      phrases: {},
      mobilePhrases: { 'capture.passport.front.title': 'A custom string' },
    },
  },
  'TC-24': {
    steps: [
      'welcome',
      {
        type: 'document',
        options: {
          documentTypes: {
            passport: true,
            driving_licence: true,
          },
        },
      },
      'face',
      'complete',
    ],
  },
  'TC-34': {
    steps: [
      'welcome',
      {
        type: 'face',
        options: {
          requestedVariant: 'video',
        },
      },
      'complete',
    ],
  },
  'TC-65': {
    onComplete: () => alert('Completed'),
    steps: [
      'welcome',
      { type: 'document', options: { useLiveDocumentCapture: true } },
      'complete',
    ],
  },
}

export default testCases
