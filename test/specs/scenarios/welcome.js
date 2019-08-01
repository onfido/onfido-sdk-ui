const expect = require('chai').expect
import { describe, it } from '../../utils/mochaw'
import { runAccessibilityTest } from '../../utils/accessibility'

export const welcomeScenarions = (driver, page, localhostUrl, lang) => {
  describe(`welcome screen in ${lang}`, () => {
    it('should verify website title', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      const title = driver.getTitle()
      expect(title).to.equal('Onfido SDK Demo')
    })

    it('should verify UI elements on the welcome screen', async () => {
      page.driver.get(localhostUrl + `?language=${lang}`)
      const welcomeCopy = page.copy(lang)
      page.verifyTitle(welcomeCopy)
      page.verifySubtitle(welcomeCopy)
      page.verifyIdentityButton(welcomeCopy)
      page.verifyFooter(welcomeCopy)
    })

    it('should verify accessibility for the welcome screen', async () => {
      runAccessibilityTest(driver)
    })

    it('should verify focus management for the welcome screen', async () => {
      page.verifyFocusManagement()
    })
  })
}
