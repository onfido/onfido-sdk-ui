import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'

const options = {
  pageObjects: ['BasePage', 'Welcome'],
}

export const modalScenarios = async (lang) => {
  describe(`MODAL scenarios in ${lang}`, options, ({ driver, pageObjects }) => {
    const { welcome } = pageObjects
    const copy = welcome.copy(lang)

    const closeModalMethod = {
      CLOSE_BUTTON_CLICK: 'welcome.clickOnCloseModalButton()',
    }

    const openAndCloseModal = async (useCloseBtn = false) => {
      await driver.get(`${localhostUrl}?language=${lang}&useModal=true`)
      driver.sleep(500)
      await welcome.clickOnOpenModalButton()
      driver.sleep(500)
      welcome.verifyTitle(copy)
      if (useCloseBtn) {
        await welcome.clickOnCloseModalButton()
      } else {
        await welcome.pressEscapeButton()
      }
      driver.sleep(500)
      await welcome.clickOnOpenModalButton()
      driver.sleep(500)
      welcome.verifyTitle(copy)
    }

    it('should be able to open, close and re-open a modal view', async () => {
      await openAndCloseModal(closeModalMethod.CLOSE_BUTTON_CLICK)
    })

    it('should be able to close modal with ESC button', async () => {
      await openAndCloseModal()
    })
  })
}
