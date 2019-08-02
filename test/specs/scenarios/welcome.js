const expect = require('chai').expect
import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../utils/config'
import { runAccessibilityTest } from '../../utils/accessibility'

export const welcomeScenarios = (driver, screens, lang) => {
  const { welcome, common } = screens
  const copy = common.copy(lang)

  describe(`WELCOME scenarios in ${lang}`, () => {
    it('should verify website title', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      const title = driver.getTitle()
      expect(title).to.equal('Onfido SDK Demo')
    })

    it('should verify UI elements on the welcome screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.verifyTitle(copy)
      welcome.verifySubtitle(copy)
      welcome.verifyIdentityButton(copy)
      welcome.verifyFooter(copy)
    })

    it('should verify accessibility for the welcome screen', async () => {
      runAccessibilityTest(driver)
    })

    it('should verify focus management for the welcome screen', async () => {
      welcome.verifyFocusManagement()
    })
  })
}
