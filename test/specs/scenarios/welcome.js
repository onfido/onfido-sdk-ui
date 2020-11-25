const expect = require('chai').expect
import { describe, it, waitAndFindElement } from '../../utils/mochaw'
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

        const titleElement = await waitAndFindElement(driver)(
          '.onfido-sdk-ui-PageTitle-titleSpan'
        )
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
