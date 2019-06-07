// const expect = require('chai').expect
// import {describe, it, clickOnPrimaryButton} from '../utils/mochaw'
// const supportedLanguage = ["en", "es"]
// const {By} = require('selenium-webdriver');

// const options = {
//   pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload', 'DocumentUploadConfirmation', 'VerificationComplete']
// }

// const localhostUrl = 'https://localhost:8080/'

// describe('Happy Paths', options, ({driver, pageObjects}) => {
//   const {documentSelection, welcome, documentUpload, documentUploadConfirmation, verificationComplete} = pageObjects

//   // const clickOnElement = async (element) => element.click()
  
//     supportedLanguage.forEach( (lang) => {
//     const documentUploadCopy = documentUpload.copy(lang)
//     const documentUploadConfirmationCopy = documentUploadConfirmation.copy(lang)

  
//       const goToPassportUploadScreen = async (parameter) => {
//         if (typeof parameter === 'undefined') {
//             parameter = ''
//           }
//         driver.get(localhostUrl + parameter)
//         welcome.primaryBtn.click()
//         documentSelection.passportIcon.click()
//       }

//       it('should upload identity card and verify UI elements', async () => {
//         driver.get(localhostUrl)
//         welcome.primaryBtn.click()
//         documentSelection.identityCardIcon.click()
//         documentUpload.verifyDocumentUploadScreenFrontOfIdentityCardTitle(documentUploadCopy)
//         documentUpload.verifyDocumentUploadScreenFrontOfIdentityCardInstructionMessage(documentUploadCopy)
//         documentUpload.getUploadInput()
//         documentUpload.upload('national_identity_card.jpg')
//         documentUploadConfirmation.confirmBtn.click()
//         documentUpload.verifyDocumentUploadScreenBackOfIdentityCardTitle(documentUploadCopy)
//         documentUpload.verifyDocumentUploadScreenBackOfIdentityCardInstructionMessage(documentUploadCopy)
//         documentUpload.getUploadInput()
//         documentUpload.upload('back_national_identity_card.jpg')
//         documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage(documentUploadConfirmationCopy)
//         documentUploadConfirmation.verifyDocumentUploadScreenMakeSureIdentityCardMessage(documentUploadConfirmationCopy)
//       })
//   })
// })
