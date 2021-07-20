import { localhostUrl } from '../../main'
import percySnapshot from '@percy/selenium-webdriver'

// TODO: this should be refactored in a way that each function can run without
// needing to receive `welcome`, `documentSelector`
// or other pageObjects names as an argument
export const goToPassportUploadScreen = async (
  driver,
  welcome,
  documentSelector,
  parameter = ''
) => {
  driver.get(localhostUrl + parameter)
  welcome.continueToNextStep()
  documentSelector.clickOnPassportIcon()
}

export const uploadFileAndClickConfirmButton = async (
  documentUploadScreen,
  confirm,
  fileName
) => {
  documentUploadScreen.getUploadInput()
  documentUploadScreen.upload(fileName)
  confirm.clickConfirmButton()
}

export const switchBrowserTab = async (tab, driver) => {
  const browserWindows = await driver.getAllWindowHandles()
  await driver.switchTo().window(browserWindows[tab])
}

export const takePercySnapshot = async (
  driver,
  text,
  options = {},
  timeout = 1000
) => {
  if (process.env.PERCY === 'true') {
    driver.sleep(timeout)
    await percySnapshot(driver, text, options)
  }
}

export const takePercySnapshotWithoutOverlay = async (driver, text) => {
  await takePercySnapshot(driver, text, {
    percyCSS: `video.onfido-sdk-ui-Camera-video { display: none; }`,
  })
}
