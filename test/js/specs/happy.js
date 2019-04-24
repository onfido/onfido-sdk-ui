const path = require('path
const expect = require('chai').expect;
import {describe, it} from '../utils/mochaw'

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload']
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths',options, ({driver,pageObjects}) => {
  const {documentSelection, welcome, documentUpload} = pageObjects

  //Welcome Screen Tests
  it('test website title', async () => {
    driver.get(localhostUrl)
    const title = driver.getTitle();
    expect(title).to.equal('Onfido SDK Demo');
  })

  it('test welcome screen title', async () => {
    driver.get(localhostUrl)
    const welcomeTitleText = welcome.getWelcomeTitle.getText()
    expect(welcomeTitleText).to.equal('Open your new bank account');
    const welcomeTitle = welcome.getWelcomeTitle.isDisplayed()
  })

  it('test welcome screen subtitle', async () => {
    driver.get(localhostUrl)
    const welcomeSubtitleText = welcome.getWelcomeSubtitle.getText()
    expect(welcomeSubtitleText).to.equal('To open a bank account, we will need to verify your identity.' + '\n' + 'It will only take a couple of minutes.');
    const welcomeSubtitle = welcome.getWelcomeSubtitle.isDisplayed()
  })

  it('test verify identity button', async () => {
    driver.get(localhostUrl)
    const verifyIdentityBtnText = welcome.getPrimaryBtn.getText()
    expect(verifyIdentityBtnText).to.equal('Verify Identity');
    const verifyIdentity = welcome.getPrimaryBtn.isDisplayed()
  })

  it('test footer is displayed', async () => {
    driver.get(localhostUrl)
    const footer = welcome.getFooter.isDisplayed()
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
