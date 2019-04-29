const path = require('path')
const expect = require('chai').expect
import {describe, it} from '../utils/mochaw'

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload']
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths', options, ({driver,$,pageObjects}) => {
  const {documentSelection, welcome, documentUpload} = pageObjects


  describe('welcome screen', function () {
    const copy = welcome.copy()

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
