import { SdkOptions } from '~types/sdk'

const testCases: { [x: string]: SdkOptions } = {
  'TC-39': {
    language: {
      locale: 'fr',
      phrases: { 'welcome.title': 'Ouvrez votre nouveau compte bancaire' },
    },
  },
  'TC-40': {
    language: {
      locale: 'es',
      phrases: { 'welcome.title': 'A custom string' },
    },
  },
  'TC-41': {
    language: {
      locale: 'es',
      phrases: {},
      mobilePhrases: { 'capture.passport.front.title': 'A custom string' },
    },
  },
  'TC-45': {
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
  'TC-64': {
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
  'TC-102': {
    onComplete: () => alert('Completed'),
    steps: [
      'welcome',
      { type: 'document', options: { useLiveDocumentCapture: true } },
      'complete',
    ],
  },
}

export default testCases
