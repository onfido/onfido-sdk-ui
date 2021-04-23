import { localhostUrl } from '../../config.json'
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

export const takePercySnapshot = async (timeout = 1000, driver, text) => {
  driver.sleep(timeout)
  await percySnapshot(driver, text)
}
