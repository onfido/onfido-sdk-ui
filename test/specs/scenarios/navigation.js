import { describe, it } from '../../utils/mochaw'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
} from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'FaceVideoIntro',
    'Camera',
    'Confirm',
    'BasePage',
  ],
}
export const navigationScenarios = async (lang) => {
  describe(
    `NAVIGATION scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        documentSelector,
        passportUploadImageGuide,
        documentUpload,
        faceVideoIntro,
        camera,
        confirm,
        basePage,
      } = pageObjects
      const copy = basePage.copy(lang)


    }
  )
}
