import { describe, it } from '../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './scenarios/sharedFlows.js'

const options = {
  screens: ['Confirm', 'DocumentSelector', 'Welcome', 'DocumentUpload']
}

describe('DOCUMENT UPLOAD ON IE11', options, ({driver, screens}) => {
  const {welcome, documentSelector, confirm, documentUpload} = screens

  it('should upload document on IE11 browser', async () => {
    goToPassportUploadScreen(driver, welcome, documentSelector)
    uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
  })

  it('should upload PDF on IE11 browser', async () => {
    goToPassportUploadScreen(driver, welcome, documentSelector)
    uploadFileAndClickConfirmButton(documentUpload, confirm, 'national_identity_card.pdf')
  })
})
