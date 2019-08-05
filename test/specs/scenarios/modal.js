import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../utils/config'

export const modalScenarios = (driver, screens, lang) => {
  const { welcome, common } = screens
  const copy = common.copy(lang)

  describe(`MODAL scenarios in ${lang}`, () => {
    const closeModalMethod = {
      CLOSE_BUTTON_CLICK: 'welcome.clickOnCloseModalButton()',
    }

    const openAndCloseModal = async (closeMethod) => {
      driver.get(localhostUrl + `?language=${lang}&useModal=true`)
      welcome.clickOnOpenModalButton()
      welcome.verifyTitle(copy)
      driver.sleep(500)
      if (closeMethod === closeModalMethod.CLOSE_BUTTON_CLICK) {
        welcome.clickOnCloseModalButton()
      } else {
        welcome.pressEscapeButton()
      }
      driver.sleep(500)
      welcome.clickOnOpenModalButton()
      welcome.verifyTitle(copy)
    }

    it('should be able to open, close and open again a modal view', async () => {
      openAndCloseModal(closeModalMethod.CLOSE_BUTTON_CLICK)
    })

    it('should be able to close modal with ESC button', async () => {
      openAndCloseModal()
    })
  })
}
