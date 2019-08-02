import { localhostUrl } from '../../utils/config'

export const goToPassportUploadScreen = async (driver, screens, parameter='') => {
  const { welcome, documentSelector } = screens
  driver.get(localhostUrl + parameter)
  welcome.primaryBtn.click()
  documentSelector.passportIcon.click()
}

export const uploadFileAndClickConfirmButton = async (screens, fileName) => {
  const { documentUpload, confirm } = screens
  documentUpload.getUploadInput()
  documentUpload.upload(fileName)
  confirm.confirmBtn.click()
}
