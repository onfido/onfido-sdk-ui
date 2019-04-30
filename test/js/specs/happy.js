const path = require('path')
const expect = require('chai').expect
import {describe, it} from '../utils/mochaw'

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload']
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths', options, ({driver, pageObjects}) => {
  const {documentSelection, welcome, documentUpload} = pageObjects

  describe('welcome screen', function () {
    const copy = welcome.copyWelcome()

    it('test website title', async () => {
      await driver.get(localhostUrl)
      const title = driver.getTitle()
      expect(title).to.equal('Onfido SDK Demo')
    })

    it('test welcome screen title', async () => {
      const welcomeTitleText = welcome.welcomeTitle.getText()
      expect(welcomeTitleText).to.equal(copy["title"])
      welcome.welcomeTitle.isDisplayed()
    })

    it('test welcome screen subtitle', async () => {
      const welcomeSubtitleText = welcome.welcomeSubtitle.getText()
      expect(welcomeSubtitleText).to.equal(copy["description_p_1"] + "\n" + copy["description_p_2"])
      welcome.welcomeSubtitle.isDisplayed()
    })

    it('test verify identity button', async () => {
      const verifyIdentityBtnText = welcome.primaryBtn.getText()
      expect(verifyIdentityBtnText).to.equal(copy["next_button"])
      welcome.primaryBtn.isDisplayed()
    })

    it('test footer is displayed', async () => {
      welcome.footer.isDisplayed()
    })
  })

  //Document selection screen
  describe('document selection screen', function () {
  const copyDocumentSelection = documentSelection.copyDocumentSelection()
  const copyDocuments = documentSelection.copyDocuments()

  it('test document selection title', async () => {
    driver.get(localhostUrl)
    welcome.primaryBtn.click()
    const documentSelectionTitleText = documentSelection.title.getText()
    expect(documentSelectionTitleText).to.equal(copyDocumentSelection["title"])
    documentSelection.title.isDisplayed()
  })

  it('test document selection subtitle', async () => {
    const documentSelectionSubtitleText = documentSelection.subtitle.getText()
    expect(documentSelectionSubtitleText).to.equal(copyDocumentSelection["hint"])
    documentSelection.subtitle.isDisplayed()
  })

  it('test passport icon presence', async () => {
    documentSelection.passportIcon.isDisplayed()
  })

  it('test passport label', async () => {
    const documentSelectionPassportLabelText = documentSelection.documentSelectionLabel.getText()
    expect(documentSelectionPassportLabelText).to.equal(copyDocuments["passport"])
    documentSelection.documentSelectionLabel.isDisplayed()
  })

  it('test passport hint', async () => {
    const documentSelectionPassportHintText = documentSelection.documentSelectionHint.getText()
    expect(documentSelectionPassportHintText).to.equal(copyDocumentSelection["passport_hint"])
    documentSelection.documentSelectionHint.isDisplayed()
  })

  it('test driving licence icon presence', async () => {
    documentSelection.drivingLicenceIcon.isDisplayed()
  })

  it('test driving licence label', async () => {
    const drivingLicenceLabelText = documentSelection.drivingLicenceLabel.getText()
    expect(drivingLicenceLabelText).to.equal(copyDocuments["driving_licence"])
    documentSelection.drivingLicenceLabel.isDisplayed()
  })

  it('test driving licence hint', async () => {
    const drivingLicenceHintText = documentSelection.drivingLicenceHint.getText()
    expect(drivingLicenceHintText).to.equal(copyDocumentSelection["driving_licence_hint"])
    documentSelection.drivingLicenceHint.isDisplayed()
  })

  it('test identity card icon presence', async () => {
    documentSelection.identityCardIcon.isDisplayed()
  })

  it('test identity card label', async () => {
    const identityCardLabelText = documentSelection.identityCardLabel.getText()
    expect(identityCardLabelText).to.equal(copyDocuments["national_identity_card"])
    documentSelection.identityCardLabel.isDisplayed()
  })

  it('test identity card hint', async () => {
    const identityCardHintText = documentSelection.identityCardHint.getText()
    expect(identityCardHintText).to.equal(copyDocumentSelection["national_identity_card_hint"])
    documentSelection.identityCardHint.isDisplayed()
  })
})

  describe('upload screen', function () {
    it('should upload a file', async () => {
      driver.get(localhostUrl)
      welcome.getPrimaryBtn().click()
      documentSelection.getPassport().click()
      const input = documentUpload.getUploadInput()
      input.sendKeys(path.join(__dirname, '../../features/helpers/resources/passport.jpg'))
    })
  })
})
