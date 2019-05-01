import Base from './BasePage.js'

class DocumentUpload extends Base{
    getUploadInput() { return (async ()=>{
      const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
      this.driver.executeScript(function(el) {
        el.setAttribute('style','display: block !important')
      },input)
      return input
    })()}

    getUploadButton() { return this.$('.onfido-sdk-ui-Uploader-button')}

    strings = (lang="en") =>
      require(`../../../src/locales/${lang}.json`)
}

export default DocumentUpload;
