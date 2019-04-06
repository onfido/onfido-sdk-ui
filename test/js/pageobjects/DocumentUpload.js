import Base from './BasePage.js'

class DocumentUpload extends Base{
    get upload() { return (async ()=>{
      const input = await this.$('.onfido-sdk-ui-CustomFileInput-input')
      await this.driver.executeScript(function(el) {
        el.setAttribute('style','display: block')
      },input)
      return input
    })()}
    
    get uploadButton() { return this.$('.onfido-sdk-ui-Uploader-button')}

    copy = (lang="en") =>
      require(`../../../src/locales/${lang}.json`)
}

export default DocumentUpload;
