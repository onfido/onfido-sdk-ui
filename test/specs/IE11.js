import { describe, it } from '../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './scenarios/sharedFlows.js'

const options = {
  screens: ['DocumentSelector', 'Welcome', 'DocumentUpload', 'Confirm']
}

describe('DOCUMENT UPLOAD ON IE11', options, ({driver, screens}) => {
  it('should upload document on IE11 browser', async () => {
    goToPassportUploadScreen(driver, screens)
    uploadFileAndClickConfirmButton(screens, 'passport.jpg')
  })

  it('should upload PDF on IE11 browser', async () => {
    goToPassportUploadScreen(driver, screens)
    uploadFileAndClickConfirmButton(screens, 'national_identity_card.pdf')
  })
})
