import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../utils/config'

export const documentSelectorScenarios = (driver, screens, lang) => {
  const { welcome, documentSelector } = screens
  describe('document selection screen', () => {
    it('should verify UI elements on the document selection screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      const documentSelectorCopy = documentSelector.copy(lang)
      welcome.primaryBtn.click()
      documentSelector.verifyTitle(documentSelectorCopy)
      documentSelector.verifySubtitle(documentSelectorCopy)
      documentSelector.verifyLabels(documentSelectorCopy)
      documentSelector.verifyHints(documentSelectorCopy)
      documentSelector.verifyIcons(documentSelectorCopy)
    })
  })
}
