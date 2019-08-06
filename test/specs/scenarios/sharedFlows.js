import { localhostUrl } from '../../config.json'

// this can be refactored to be able to work without passing screens
export const goToPassportUploadScreen = async (driver, welcome, documentSelector, parameter='') => {
  driver.get(localhostUrl + parameter)
  welcome.primaryBtn.click()
  documentSelector.passportIcon.click()
}

export const uploadFileAndClickConfirmButton = async (documentUpload, confirm, fileName) => {
  documentUpload.getUploadInput()
  documentUpload.upload(fileName)
  confirm.confirmBtn.click()
}
