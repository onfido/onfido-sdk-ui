const path = require('path')
const expect = require('chai').expect;
import {describe, it} from '../utils/mochaw'

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload']
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths',options, ({driver,$,pageObjects}) => {
  const {documentSelection, welcome, documentUpload} = pageObjects

  //Welcome Screen Tests
  const copyWelcome = welcome.copyWelcome()
  it('test website title', async () => {
    await driver.get(localhostUrl)
    const title = await driver.getTitle();
    expect(title).to.equal('Onfido SDK Demo');
  })

  it('test welcome screen title', async () => {
    const welcomeTitleText = await welcome.welcomeTitle.getText()
    expect(welcomeTitleText).to.equal(copyWelcome["title"]);
    await welcome.welcomeTitle.isDisplayed()
  })

  it('test welcome screen subtitle', async () => {
    const welcomeSubtitleText = await welcome.welcomeSubtitle.getText()
    expect(welcomeSubtitleText).to.equal(copyWelcome["description_p_1"] + "\n" + copyWelcome["description_p_2"]);
    await welcome.welcomeSubtitle.isDisplayed()
  })

  it('test verify identity button', async () => {
    const verifyIdentityBtnText = await welcome.primaryBtn.getText()
    expect(verifyIdentityBtnText).to.equal(copyWelcome["next_button"]);
    await welcome.primaryBtn.isDisplayed()
  })

  it('test footer is displayed', async () => {
    await welcome.footer.isDisplayed()
   })

  //Document selection screen
  const copyDocumentSelection = documentSelection.copyDocumentSelection()
  const copyDocuments = documentSelection.copyDocuments()

  it('test document selection title', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    const documentSelectionTitleText = await documentSelection.title.getText()
    expect(documentSelectionTitleText).to.equal(copyDocumentSelection["title"]);
    await documentSelection.title.isDisplayed()
  })

  it('test document selection subtitle', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    const documentSelectionSubtitleText = await documentSelection.subtitle.getText()
    expect(documentSelectionSubtitleText).to.equal(copyDocumentSelection["hint"]);
    await documentSelection.subtitle.isDisplayed()
  })

  it('test passport icon presence', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    await documentSelection.passportIcon.isDisplayed()
  })

  it('test passport label', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    const documentSelectionPassportLabelText = await documentSelection.documentSelectionLabel.getText()
    expect(documentSelectionPassportLabelText).to.equal(copyDocuments["passport"]);
    await documentSelection.documentSelectionLabel.isDisplayed()
  })

  it('test passport hint', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    const documentSelectionPassportHintText = await documentSelection.documentSelectionHint.getText()
    expect(documentSelectionPassportHintText).to.equal(copyDocumentSelection["passport_hint"]);
    await documentSelection.documentSelectionHint.isDisplayed()
  })

  it('test driving licence icon presence', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    await documentSelection.drivingLicenceIcon.isDisplayed()
  })

  it('test driving licence label', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    const drivingLicenceLabelText = await documentSelection.drivingLicenceLabel.getText()
    expect(drivingLicenceLabelText).to.equal(copyDocuments["driving_licence"]);
    await documentSelection.drivingLicenceLabel.isDisplayed()
  })

  it('test driving licence hint', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    const drivingLicenceHintText = await documentSelection.drivingLicenceHint.getText()
    expect(drivingLicenceHintText).to.equal(copyDocumentSelection["driving_licence_hint"]);
    await documentSelection.drivingLicenceHint.isDisplayed()
  })

  it('test identity card icon presence', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    await documentSelection.identityCardIcon.isDisplayed()
  })

  it('test identity card label', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    const identityCardLabelText = await documentSelection.identityCardLabel.getText()
    expect(identityCardLabelText).to.equal(copyDocuments["national_identity_card"]);
    await documentSelection.identityCardLabel.isDisplayed()
  })

  it('test identity card hint', async () => {
    await driver.get(localhostUrl)
    await welcome.primaryBtn.click()
    const identityCardHintText = await documentSelection.identityCardHint.getText()
    expect(identityCardHintText).to.equal(copyDocumentSelection["national_identity_card_hint"]);
    await documentSelection.identityCardHint.isDisplayed()
  })

  //Document upload screen
  it('should upload a file', async () => {
    driver.get(localhostUrl)
    welcome.getPrimaryBtn().click()
    documentSelection.getPassport().click()
    const input = documentUpload.getUploadInput()
    input.sendKeys(path.join(__dirname,'../../features/helpers/resources/passport.jpg'))
  })
})
