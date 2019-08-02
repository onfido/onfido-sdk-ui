import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../utils/config'

export const documentSelectorScenarios = (driver, screens, lang) => {
  const { welcome, documentSelector, common } = screens
  const copy = common.copy(lang)

  describe(`DOCUMENT SELECTOR scenarios in ${lang}`, () => {
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
