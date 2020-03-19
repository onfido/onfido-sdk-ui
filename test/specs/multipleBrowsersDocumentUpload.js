import { describe, it } from '../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './scenarios/sharedFlows.js'

const options = {
  pageObjects: ['Confirm', 'DocumentSelector', 'Welcome', 'DocumentUpload']
}

describe('DOCUMENT AND PDF UPLOAD ON MULTIPLE BROWSERS', options, ({driver, pageObjects}) => {
  const {welcome, documentSelector, confirm, documentUpload} = pageObjects

  it('SHOULD UPLOAD DOCUMENT WITH JPG', async () => {
    goToPassportUploadScreen(driver, welcome, documentSelector)
    uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
  })

  it('SHOULD UPLOAD DOCUMENT WITH PDF', async () => {
    goToPassportUploadScreen(driver, welcome, documentSelector)
    uploadFileAndClickConfirmButton(documentUpload, confirm, 'national_identity_card.pdf')
  })
})
