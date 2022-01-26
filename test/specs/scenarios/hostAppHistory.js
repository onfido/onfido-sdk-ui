import { describe, it } from '../../utils/mochaw'
import { uploadFileAndClickConfirmButton } from './sharedFlows.js'
import { localhostUrl } from '../../config.json'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'DocumentUpload',
    'PassportUploadImageGuide',
    'Confirm',
    'BasePage',
    'DummyHostApp',
  ],
}
export const hostAppHistoryScenarios = async (lang = 'en_US') => {
  describe(
    `HOST APP HISTORY scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        documentSelector,
        documentUpload,
        passportUploadImageGuide,
        confirm,
        basePage,
        dummyHostApp,
      } = pageObjects
      const copy = basePage.copy(lang)
    }
  )
}
