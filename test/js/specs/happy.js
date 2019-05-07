const path = require('path')
const expect = require('chai').expect
const locale = (lang="en") => require(`../../../src/locales/${lang}.json`)
import {describe, it} from '../utils/mochaw'

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload', 'DocumentUploadConfirmation', 'VerificationComplete']
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths', options, ({driver, pageObjects, until}) => {
  const {documentSelection, welcome, documentUpload, documentUploadConfirmation, verificationComplete} = pageObjects

  describe('welcome screen', function () {

    const copy = locale("en")
    const welcomeLocale = copy["welcome"]

    it('should verify website title', async () => {
       driver.get(localhostUrl)
      const title = driver.getTitle()
      expect(title).to.equal('Onfido SDK Demo')
    })

    it('should display welcome screen title', async () => {
      const welcomeTitleText = welcome.welcomeTitle.getText()
      expect(welcomeTitleText).to.equal(welcomeLocale["title"])
      welcome.welcomeTitle.isDisplayed()
    })

    it('should display welcome screen subtitle', async () => {
      const welcomeSubtitleText = welcome.welcomeSubtitle.getText()
      expect(welcomeSubtitleText).to.equal(welcomeLocale["description_p_1"] + "\n" + welcomeLocale["description_p_2"])
      welcome.welcomeSubtitle.isDisplayed()
    })

    it('should display verify identity button', async () => {
      const verifyIdentityBtnText = welcome.primaryBtn.getText()
      expect(verifyIdentityBtnText).to.equal(welcomeLocale["next_button"])
      welcome.primaryBtn.isDisplayed()
    })

    it('should display footer', async () => {
      welcome.footer.isDisplayed()
    })
  })

  //Document selection screen
  describe('document selection screen', function () {
  const copy = locale("en")
  const documentSelectionLocale = copy

    it('should display document selection title', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      const documentSelectionTitleText = documentSelection.title.getText()
      expect(documentSelectionTitleText).to.equal(documentSelectionLocale["document_selector"]["identity"]["title"])
      documentSelection.title.isDisplayed()
    })

    it('should display  document selection subtitle', async () => {
      const documentSelectionSubtitleText = documentSelection.subtitle.getText()
      expect(documentSelectionSubtitleText).to.equal(documentSelectionLocale["document_selector"]["identity"]["hint"])
      documentSelection.subtitle.isDisplayed()
    })

    it('should display passport icon', async () => {
      documentSelection.passportIcon.isDisplayed()
    })

    it('should display passport label', async () => {
      const documentSelectionPassportLabelText = documentSelection.documentSelectionLabel.getText()
      expect(documentSelectionPassportLabelText).to.equal(documentSelectionLocale["passport"])
      documentSelection.documentSelectionLabel.isDisplayed()
    })

    it('should display passport hint', async () => {
      const documentSelectionPassportHintText = documentSelection.documentSelectionHint.getText()
      expect(documentSelectionPassportHintText).to.equal(documentSelectionLocale["document_selector"]["identity"]["passport_hint"])
      documentSelection.documentSelectionHint.isDisplayed()
    })

    it('should display driving licence icon', async () => {
      documentSelection.drivingLicenceIcon.isDisplayed()
    })

    it('should display driving licence label', async () => {
      const drivingLicenceLabelText = documentSelection.drivingLicenceLabel.getText()
      expect(drivingLicenceLabelText).to.equal(documentSelectionLocale["driving_licence"])
      documentSelection.drivingLicenceLabel.isDisplayed()
    })

    it('should display driving licence hint', async () => {
      const drivingLicenceHintText = documentSelection.drivingLicenceHint.getText()
      expect(drivingLicenceHintText).to.equal(documentSelectionLocale["document_selector"]["identity"]["driving_licence_hint"])
      documentSelection.drivingLicenceHint.isDisplayed()
    })

    it('should display identity card icon', async () => {
      documentSelection.identityCardIcon.isDisplayed()
    })

    it('should display identity card label', async () => {
      const identityCardLabelText = documentSelection.identityCardLabel.getText()
      expect(identityCardLabelText).to.equal(documentSelectionLocale["national_identity_card"])
      documentSelection.identityCardLabel.isDisplayed()
    })

    it('should display identity card hint', async () => {
      const identityCardHintText = documentSelection.identityCardHint.getText()
      expect(identityCardHintText).to.equal(documentSelectionLocale["document_selector"]["identity"]["national_identity_card_hint"])
      documentSelection.identityCardHint.isDisplayed()
    })
  })

  //Document upload screen
  describe('document upload screen', function () {
  const copy = locale("en")
  const documentUploadLocale = copy
  const documentUploadConfirmationLocale = copy

  function waitForUploadToFinish() { return (async ()=>{
    const confirmBtn = await this.$('.onfido-sdk-ui-Confirm-btn-primary')
    await driver.wait(until.elementIsVisible(confirmBtn),5000);
  })}

    it('should display cross device icon', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      documentUpload.crossDeviceIcon.isDisplayed()
    })

    it('should display cross device header', async () => {
      const crossDeviceHeaderText = documentUpload.crossDeviceHeader.getText()
      expect(crossDeviceHeaderText).to.equal(documentUploadLocale["cross_device"]["switch_device"]["header"])
      documentUpload.crossDeviceHeader.isDisplayed()
    })

    it('should display cross device submessage', async () => {
      const crossDeviceSubMessageText = documentUpload.crossDeviceSubMessage.getText()
      expect(crossDeviceSubMessageText).to.equal(documentUploadLocale["cross_device"]["switch_device"]["submessage"])
      documentUpload.crossDeviceSubMessage.isDisplayed()
    })

    it('should display cross device arrow presence', async () => {
      documentUpload.crossDeviceArrow.isDisplayed()
    })

    it('should display uploader icon presence', async () => {
      documentUpload.uploaderIcon.isDisplayed()
    })

    it('should display uploader button', async () => {
      const uploaderBtnText = documentUpload.uploaderBtn.getText()
      expect(uploaderBtnText).to.equal(documentUploadLocale["capture"]["upload_file"])
      documentUpload.uploaderBtn.isDisplayed()
    })

    it('should upload a passport and verify UI elements', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const passportTitleText =  documentUpload.title.getText()
      expect(passportTitleText).to.equal(documentUploadLocale["capture"]["passport"]["front"]["title"])
      documentUpload.title.isDisplayed()
      const passportInstructionMessage = documentUpload.uploaderInstructionsMessage.getText()
      expect(passportInstructionMessage).to.equal(documentUploadLocale["capture"]["passport"]["front"]["instructions"])
      documentUpload.uploaderInstructionsMessage.isDisplayed()
      const input = documentUpload.getUploadInput()
      input.sendKeys(path.join(__dirname, '../../features/helpers/resources/passport.jpg'))
      waitForUploadToFinish
      const checkReadabilityText = documentUpload.title.getText()
      expect(checkReadabilityText).to.equal(documentUploadLocale["confirm"]["document"]["title"])
      const makeSureClearDetailsMessage = documentUploadConfirmation.makeSureClearDetailsMessage.getText()
      expect(makeSureClearDetailsMessage).to.equal(documentUploadLocale["confirm"]["passport"]["message"])
      documentUploadConfirmation.makeSureClearDetailsMessage.isDisplayed()
    })

    it('should upload driving licence and verify UI elemetns', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.drivingLicenceIcon.click()
      const frontOfDrivingLicenceTitle = documentUpload.title.getText()
      documentUpload.title.isDisplayed()
      expect(frontOfDrivingLicenceTitle).to.equal(documentUploadLocale["capture"]["driving_licence"]["front"]["title"])
      const frontOfDrivingLicenceInstructionMessage = documentUpload.uploaderInstructionsMessage.getText()
      expect(frontOfDrivingLicenceInstructionMessage).to.equal(documentUploadLocale["capture"]["driving_licence"]["front"]["instructions"])
      documentUpload.uploaderInstructionsMessage.isDisplayed()
      const uploadFront = documentUpload.getUploadInput()
      uploadFront.sendKeys(path.join(__dirname,'../../features/helpers/resources/uk_driving_licence.png'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const backOfDrivingLicenceTitle = documentUpload.title.getText()
      expect(backOfDrivingLicenceTitle).to.equal(documentUploadLocale["capture"]["driving_licence"]["back"]["title"])
      const backOfDrivingLicenceInstructionMessage = documentUpload.uploaderInstructionsMessage.getText()
      expect(backOfDrivingLicenceInstructionMessage).to.equal(documentUploadLocale["capture"]["driving_licence"]["back"]["instructions"])
      documentUpload.uploaderInstructionsMessage.isDisplayed()
      const uploadBack = documentUpload.getUploadInput()
      uploadBack.sendKeys(path.join(__dirname,'../../features/helpers/resources/back_driving_licence.jpg'))
      waitForUploadToFinish
      const checkReadabilityText = documentUpload.title.getText()
      expect(checkReadabilityText).to.equal(documentUploadLocale["confirm"]["document"]["title"])
      documentUpload.title.isDisplayed()
      const makeSureClearDetailsMessage = documentUploadConfirmation.makeSureClearDetailsMessage.getText()
      expect(makeSureClearDetailsMessage).to.equal(documentUploadConfirmationLocale["confirm"]["driving_licence"]["message"])
      documentUploadConfirmation.makeSureClearDetailsMessage.isDisplayed()
    })

    it('should upload identity card and verify UI elemetns', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.identityCardIcon.click()
      const frontOfIdentityCardTitle = documentUpload.title.getText()
      expect(frontOfIdentityCardTitle).to.equal(documentUploadLocale["capture"]["national_identity_card"]["front"]["title"])
      documentUpload.title.isDisplayed()
      const frontOfIdentityCardInstructionMessage = documentUpload.uploaderInstructionsMessage.getText()
      expect(frontOfIdentityCardInstructionMessage).to.equal(documentUploadLocale["capture"]["national_identity_card"]["front"]["instructions"])
      documentUpload.uploaderInstructionsMessage.isDisplayed()
      const uploadFront = documentUpload.getUploadInput()
      uploadFront.sendKeys(path.join(__dirname,'../../features/helpers/resources/national_identity_card.jpg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const backOfIdentityCardTitle = documentUpload.title.getText()
      expect(backOfIdentityCardTitle).to.equal('Back of identity card')
      const backOfIdentityCardInstructionMessage = documentUpload.uploaderInstructionsMessage.getText()
      expect(backOfIdentityCardInstructionMessage).to.equal(documentUploadLocale["capture"]["national_identity_card"]["back"]["instructions"])
      documentUpload.uploaderInstructionsMessage.isDisplayed()
      const uploadBack = documentUpload.getUploadInput()
      uploadBack.sendKeys(path.join(__dirname,'../../features/helpers/resources/back_national_identity_card.jpg'))
      waitForUploadToFinish
      const checkReadabilityText = documentUpload.title.getText()
      expect(checkReadabilityText).to.equal(documentUploadLocale["confirm"]["document"]["title"])
      documentUpload.title.isDisplayed()
      const makeSureClearDetailsMessage = documentUploadConfirmation.makeSureClearDetailsMessage.getText()
      expect(makeSureClearDetailsMessage).to.equal(documentUploadConfirmationLocale["confirm"]["national_identity_card"]["message"])
      documentUploadConfirmation.makeSureClearDetailsMessage.isDisplayed()
    })

    it('should return no document message after uploading non-doc image', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const input = documentUpload.getUploadInput()
      input.sendKeys(path.join(__dirname, '../../features/helpers/resources/llama.pdf'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const errorTitleText = documentUploadConfirmation.errorTitleText.getText()
      expect(errorTitleText).to.equal(documentUploadConfirmationLocale["errors"]["invalid_capture"]["message"])
      documentUploadConfirmation.errorTitleText.isDisplayed()
      documentUploadConfirmation.errorTitleIcon.isDisplayed()
      const errorInstruction = documentUploadConfirmation.errorInstruction.getText()
      expect(errorInstruction).to.equal(documentUploadConfirmationLocale["errors"]["invalid_capture"]["instruction"])
      documentUploadConfirmation.errorInstruction.isDisplayed()
    })

    it('should upload a document after retrying', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const inputImg = documentUpload.getUploadInput()
      inputImg.sendKeys(path.join(__dirname, '../../features/helpers/resources/llama.pdf'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      waitForUploadToFinish
      documentUploadConfirmation.redoBtn.click()
      const input = documentUpload.getUploadInput()
      input.sendKeys(path.join(__dirname, '../../features/helpers/resources/passport.jpg'))
      waitForUploadToFinish
      const checkReadabilityText = documentUpload.title.getText()
      expect(checkReadabilityText).to.equal(documentUploadLocale["confirm"]["document"]["title"])
    })

    it('should return file size too large message for doc', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const inputMultipleFaces = documentUpload.getUploadInput()
      inputMultipleFaces.sendKeys(path.join(__dirname, '../../features/helpers/resources/over_10mb_face.jpg'))
      const uploaderError = documentUpload.uploaderError.getText()
      expect(uploaderError).to.equal('File size too large. Size needs to be smaller than 10MB.')
      documentUpload.uploaderError.isDisplayed()
    })

    it('should return file size too large message for selfie', async () => {
      driver.get(localhostUrl + '?async=false&language=&useWebcam=false')
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const inputMultipleFaces = documentUpload.getUploadInput()
      inputMultipleFaces.sendKeys(path.join(__dirname, '../../features/helpers/resources/passport.jpg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const inputSelfie = documentUpload.getUploadInput()
      inputSelfie.sendKeys(path.join(__dirname, '../../features/helpers/resources/over_10mb_face.jpg'))
      const uploaderError = documentUpload.uploaderError.getText()
      expect(uploaderError).to.equal('File size too large. Size needs to be smaller than 10MB.')
      documentUpload.uploaderError.isDisplayed()
    })

    it('should return use another file type message', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const inputMultipleFaces = documentUpload.getUploadInput()
      inputMultipleFaces.sendKeys(path.join(__dirname, '../../features/helpers/resources/unsupported_file_type.txt'))
      const uploaderError = documentUpload.uploaderError.getText()
      expect(uploaderError).to.equal('File not uploading. Try using another file type.')
      documentUpload.uploaderError.isDisplayed()
    })

    it('should return unsupported file type error for selfie', async () => {
      driver.get(localhostUrl + '?async=false&language=&useWebcam=false')
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const inputMultipleFaces = documentUpload.getUploadInput()
      inputMultipleFaces.sendKeys(path.join(__dirname, '../../features/helpers/resources/passport.jpg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const inputSelfie = documentUpload.getUploadInput()
      inputSelfie.sendKeys(path.join(__dirname, '../../features/helpers/resources/national_identity_card.pdf'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const unsupportedFileError = documentUploadConfirmation.errorTitleText.getText()
      expect(unsupportedFileError).to.equal(documentUploadConfirmationLocale["errors"]["unsupported_file"]["message"])
      documentUploadConfirmation.errorTitleText.isDisplayed()
      documentUploadConfirmation.errorTitleIcon.isDisplayed()
      const unsupportedFileInstruction = documentUploadConfirmation.errorInstruction.getText()
      expect(unsupportedFileInstruction).to.equal(documentUploadConfirmationLocale["errors"]["unsupported_file"]["instruction"])
    })

    it('should upload selfie', async () => {
      driver.get(localhostUrl + '?async=false&language=&useWebcam=false')
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const input = documentUpload.getUploadInput()
      input.sendKeys(path.join(__dirname, '../../features/helpers/resources/passport.jpg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const inputSelfie = documentUpload.getUploadInput()
      inputSelfie.sendKeys(path.join(__dirname, '../../features/helpers/resources/face.jpeg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      verificationComplete.verificationCompleteIcon.isDisplayed()
      const verificationCompleteMessage = verificationComplete.verificationCompleteMessage.getText()
      expect(verificationCompleteMessage).to.equal(documentUploadLocale["complete"]["message"])
      verificationComplete.verificationCompleteMessage.isDisplayed()
      const verificationCompleteThankYou = verificationComplete.verificationCompleteThankYou.getText()
      expect(verificationCompleteThankYou).to.equal(documentUploadLocale["complete"]["submessage"])
      verificationComplete.verificationCompleteThankYou.isDisplayed()
    })

    //no face found

    it('should return multiple faces error', async () => {
      driver.get(localhostUrl + '?async=false&language=&useWebcam=false')
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const input = documentUpload.getUploadInput()
      input.sendKeys(path.join(__dirname, '../../features/helpers/resources/passport.jpg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const inputSelfie = documentUpload.getUploadInput()
      inputSelfie.sendKeys(path.join(__dirname, '../../features/helpers/resources/two_faces.jpg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const multipleFacesError = documentUploadConfirmation.errorTitleText.getText()
      expect(multipleFacesError).to.equal(documentUploadConfirmationLocale["errors"]["multiple_faces"]["message"])
      documentUploadConfirmation.errorTitleText.isDisplayed()
      documentUploadConfirmation.errorTitleIcon.isDisplayed()
      const multipleFacesInstruction = documentUploadConfirmation.errorInstruction.getText()
      expect(multipleFacesInstruction).to.equal(documentUploadConfirmationLocale["errors"]["multiple_faces"]["instruction"])
    })

    it('should return glare detected message on front and back of doc', async () => {
      driver.get(localhostUrl + '?async=false&language=&useWebcam=false')
      welcome.primaryBtn.click()
      documentSelection.drivingLicenceIcon.click()
      const input = documentUpload.getUploadInput()
      input.sendKeys(path.join(__dirname, '../../features/helpers/resources/identity_card_with_glare.jpg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const glareDetectedMessageFront = documentUploadConfirmation.errorTitleText.getText()
      expect(glareDetectedMessageFront).to.equal(documentUploadConfirmationLocale["errors"]["glare_detected"]["message"])
      documentUploadConfirmation.errorTitleText.isDisplayed()
      documentUploadConfirmation.warningTitleIcon.isDisplayed()
      const multipleFacesInstructionFront = documentUploadConfirmation.errorInstruction.getText()
      expect(multipleFacesInstructionFront).to.equal(documentUploadConfirmationLocale["errors"]["glare_detected"]["instruction"])
      documentUploadConfirmation.confirmBtn.click()
      const inputBack = documentUpload.getUploadInput()
      inputBack.sendKeys(path.join(__dirname, '../../features/helpers/resources/identity_card_with_glare.jpg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const glareDetectedMessageBack = documentUploadConfirmation.errorTitleText.getText()
      expect(glareDetectedMessageBack).to.equal(documentUploadConfirmationLocale["errors"]["glare_detected"]["message"])
      documentUploadConfirmation.errorTitleText.isDisplayed()
      documentUploadConfirmation.warningTitleIcon.isDisplayed()
      const multipleFacesInstructionBack = documentUploadConfirmation.errorInstruction.getText()
      expect(multipleFacesInstructionBack).to.equal(documentUploadConfirmationLocale["errors"]["glare_detected"]["instruction"])
    })

    it('should be able to retry document upload', async () => {
      driver.get(localhostUrl + '?async=false&language=&useWebcam=false')
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
      const input = documentUpload.getUploadInput()
      input.sendKeys(path.join(__dirname, '../../features/helpers/resources/passport.jpg'))
      waitForUploadToFinish
      documentUploadConfirmation.redoBtn.click()
      const retryInput = documentUpload.getUploadInput()
      retryInput.sendKeys(path.join(__dirname, '../../features/helpers/resources/passport.pdf'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      const inputSelfie = documentUpload.getUploadInput()
      inputSelfie.sendKeys(path.join(__dirname, '../../features/helpers/resources/face.jpeg'))
      waitForUploadToFinish
      documentUploadConfirmation.confirmBtn.click()
      verificationComplete.verificationCompleteIcon.isDisplayed()
      const verificationCompleteMessage = verificationComplete.verificationCompleteMessage.getText()
      expect(verificationCompleteMessage).to.equal(documentUploadLocale["complete"]["message"])
      verificationComplete.verificationCompleteMessage.isDisplayed()
      const verificationCompleteThankYou = verificationComplete.verificationCompleteThankYou.getText()
      expect(verificationCompleteThankYou).to.equal(documentUploadLocale["complete"]["submessage"])
      verificationComplete.verificationCompleteThankYou.isDisplayed()
    })
  })
})
