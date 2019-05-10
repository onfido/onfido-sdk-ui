import Base from './BasePage.js'

class DocumentUpload extends Base{

    get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
    get crossDeviceIcon() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-icon')}
    get crossDeviceHeader() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-header')}
    get crossDeviceSubMessage() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-submessage')}
    get crossDeviceArrow() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-chevron')}
    get uploaderIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
    get uploaderInstructionsMessage() { return this.$('.onfido-sdk-ui-Uploader-instructionsCopy')}
    get uploaderBtn() { return this.$('.onfido-sdk-ui-Uploader-buttons')}
    get uploaderError() { return this.$('.onfido-sdk-ui-Uploader-error')}
    getUploadInput() { return (async ()=>{
      const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
      this.driver.executeScript(function(el) {
        el.setAttribute('style','display: block !important')
      },input)
      return input
    })()}

    getUploadButton() { return this.$('.onfido-sdk-ui-Uploader-button')}

    assignDir(filename) {
      const pathToFile = '../../features/helpers/resources/' + filename
      return pathToFile
    }
    
}

export default DocumentUpload;