const expect = require('chai').expect
const { By, until } = require('selenium-webdriver')
import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'

const options = {
  pageObjects: ['BasePage', 'Welcome'],
}

export const welcomeScenarios = async (lang) => {
  describe.only(
    `WELCOME scenarios in ${lang}`,
    options,
    ({ driver /*, pageObjects*/ }) => {
      // const { welcome } = pageObjects
      // const copy = welcome.copy(lang)

      it('should verify website title', async () => {
        driver.get(`${localhostUrl}?language=${lang}`)
        const title = driver.getTitle()
        expect(title).to.equal('Onfido SDK Demo')
      })

      it.only('should verify UI elements on the welcome screen', async () => {
        driver.get(`${localhostUrl}?language=${lang}`)

        const locator = By.css('.onfido-sdk-ui-PageTitle-titleSpan')
        console.log('locator:', locator)

        const titleElement = await driver.findElement(async () => {
          await driver.wait(until.elementLocated(locator))
          const element = await driver.findElement(locator)
          console.log('element:', element)
          return element
        })

        const title = await titleElement.getText()
        console.log('title:', titleElement, `"${title}"`)
        // await welcome.verifyTitle(copy)
        // welcome.verifySubtitle(copy)
        // welcome.verifyIdentityButton(copy)
        // welcome.verifyFooter(copy)
      })
    }
  )
}
