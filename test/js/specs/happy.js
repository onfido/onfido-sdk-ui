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
  it('test website title', async () => {
    await driver.get(localhostUrl)
    const title = await driver.getTitle();
    expect(title).to.equal('Onfido SDK Demo');
  })

  it('test welcome screen title', async () => {
    const welcomeTitleText = await welcome.welcomeTitle.getText()
    expect(welcomeTitleText).to.equal('Open your new bank account');
    const welcomeTitle = await welcome.welcomeTitle.isDisplayed()
  })

  it('test welcome screen subtitle', async () => {
    const welcomeSubtitleText = await welcome.welcomeSubtitle.getText()
    expect(welcomeSubtitleText).to.equal('To open a bank account, we will need to verify your identity.' + '\n' + 'It will only take a couple of minutes.');
    const welcomeSubtitle = await welcome.welcomeSubtitle.isDisplayed()
  })

  it('test verify identity button', async () => {
    const verifyIdentityBtnText = await welcome.primaryBtn.getText()
    expect(verifyIdentityBtnText).to.equal('Verify Identity');
    const verifyIdentity = await welcome.primaryBtn.isDisplayed()
  })

  it('test footer is displayed', async () => {
    const footer = await welcome.footer.isDisplayed()
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
