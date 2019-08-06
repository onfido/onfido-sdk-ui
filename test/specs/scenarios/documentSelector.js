import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'

const options = {
  screens: [
    'Welcome',
    'DocumentSelector',
    'BasePage'
  ]
}

export const documentSelectorScenarios = async (lang) => {
  describe(`DOCUMENT SELECTOR scenarios in ${lang}`, options, ({driver, screens}) => {
    const { welcome, documentSelector, basePage } = screens
    const copy = basePage.copy(lang)

    it('should verify UI elements on the document selection screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      documentSelector.verifyTitle(copy)
      documentSelector.verifySubtitle(copy)
      documentSelector.verifyLabels(copy)
      documentSelector.verifyHints(copy)
      documentSelector.verifyIcons(copy)
    })
  })
}
