const expect = require('chai').expect
import { By } from 'selenium-webdriver'
import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'

const options = {
  pageObjects: ['BasePage', 'Welcome'],
}

export const welcomeScenarios = async (lang) => {
  describe.only(
    `WELCOME scenarios in ${lang}`,
    options,
    ({ driver /* , pageObjects */ }) => {
      /* const { welcome } = pageObjects
      const copy = welcome.copy(lang) */

      it('should verify website title', async () => {
        driver.get(`${localhostUrl}?language=${lang}`)
        const title = driver.getTitle()
        expect(title).to.equal('Onfido SDK Demo')
      })

      it.only('should verify UI elements on the welcome screen', async () => {
        driver.get(`${localhostUrl}?language=${lang}`)

        const children = driver.findElements(By.css('#demo-app > *'))
        const tags = await Promise.all(
          children.map(async (child) => [
            await child.getTagName(),
            await child.getAttribute('class'),
          ])
        )
        console.log('invoke:', tags)

        // await welcome.verifyTitle(copy)
        // welcome.verifySubtitle(copy)
        // welcome.verifyIdentityButton(copy)
        // welcome.verifyFooter(copy)
      })
    }
  )
}
