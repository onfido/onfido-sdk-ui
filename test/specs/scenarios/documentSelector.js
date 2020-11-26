import { before } from 'mocha'
import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'

const options = {
  pageObjects: ['Welcome', 'DocumentSelector', 'BasePage'],
}

export const documentSelectorScenarios = async (lang) => {
  describe.only(
    `DOCUMENT SELECTOR scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const { welcome, documentSelector, basePage } = pageObjects
      const copy = basePage.copy(lang)

      before(() => {
        console.log('invoke beforeAll')
      })

      it('should verify UI elements on the document selection screen', async () => {
        driver.get(`${localhostUrl}?language=${lang}`)
        welcome.continueToNextStep()
        documentSelector.verifyTitle(copy)
        documentSelector.verifySubtitle(copy)
        documentSelector.verifyLabels(copy)
        documentSelector.verifyHints(copy)
        documentSelector.verifyIcons()
      })
    }
  )
}
