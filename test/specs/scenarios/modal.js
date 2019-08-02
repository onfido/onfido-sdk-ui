import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../utils/config'

export const modalScenarios = (driver, screens, lang) => {
  const { welcome, common } = screens
  const copy = common.copy(lang)

  describe(`MODAL scenarios in ${lang}`, () => {
    it('should be able to open, close and open again a modal view', async () => {
      driver.get(localhostUrl + `?language=${lang}&useModal=true`)
      welcome.clickOnOpenModalButton()
      welcome.verifyTitle(copy)
      driver.sleep(500)
      welcome.clickOnCloseModalButton()
      driver.sleep(500)
      welcome.clickOnOpenModalButton()
      welcome.verifyTitle(copy)
    })
  })
}
