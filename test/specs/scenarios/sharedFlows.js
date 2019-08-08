import { localhostUrl } from '../../config.json'

// TODO: this should be refactored in a way that each function can run without
// needing to receive `welcome`, `documentSelector`
// or other pageObjects names as an argument
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
