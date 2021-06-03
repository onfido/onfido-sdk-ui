import { expect } from 'chai'
import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import { takePercySnapshot } from './sharedFlows'

const options = {
  pageObjects: ['BasePage', 'Welcome'],
}

export const welcomeScenarios = async (lang) => {
  describe(
    `WELCOME scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const { welcome } = pageObjects
      const copy = welcome.copy(lang)

      it('should verify website title', async () => {
        driver.get(`${localhostUrl}?language=${lang}`)
        const title = driver.getTitle()
        expect(title).to.equal('Onfido SDK Demo')
      })

      it('should verify UI elements on the welcome screen @percy', async () => {
        driver.get(`${localhostUrl}?language=${lang}`)
        welcome.verifyTitle(copy)
        welcome.verifyInstructions(copy)
        welcome.verifyIdentityButton(copy)
        welcome.verifyFooter(copy)
      })

      it('should verify UI elements on the welcome screen - doc liveness flow', async () => {
        driver.get(`${localhostUrl}?language=${lang}&docVideo=true`)
        welcome.verifyTitle(copy)
        welcome.verifySubtitle(copy)
        welcome.verifyInstructions(copy)
        welcome.verifyRecordingLimit(copy)
        welcome.verifyIdentityButton(copy)
        welcome.verifyFooter(copy)
        await takePercySnapshot(
          driver,
          `Onfido SDK UI elements on the welcome screen in ${lang}`
        )
      })
    }
  )
}
