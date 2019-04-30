import Base from './BasePage.js'

class DocumentUploadConfirmation extends Base{

  get makeSureClearDetailsMessage() { return this.$('div#onfido-mount div.onfido-sdk-ui-Title-titleWrapper.onfido-sdk-ui-Title-smaller.onfido-sdk-ui-Confirm-title > div:nth-child(2)')}
  get redoBtn() { return this.$('div#onfido-mount button.onfido-sdk-ui-Confirm-retake.onfido-sdk-ui-Button-button.onfido-sdk-ui-Button-button-outline')}
  get confirmBtn() { return this.$('div#onfido-mount button.onfido-sdk-ui-Confirm-btn-primary.onfido-sdk-ui-Button-button.onfido-sdk-ui-Button-button-primary')}
  get errorTitleText() { return this.$('div#onfido-mount span.onfido-sdk-ui-Error-title-text')}
  get errorTitleIcon() { return this.$('div#onfido-mount span.onfido-sdk-ui-Error-title-icon-error')}
  get errorInstruction() { return this.$('div#onfido-mount p > span')}

  get waitForUploadToFinish() { return (async ()=>{
    const confirmBtn = await this.$('div#onfido-mount button.onfido-sdk-ui-Confirm-retake.onfido-sdk-ui-Button-button.onfido-sdk-ui-Button-button-outline')
    await driver.wait(until.elementIsVisible(confirmBtn),5000);
  })}

  copy = (lang="en") =>
    require(`../../../src/locales/${lang}.json`)
}

export default DocumentUploadConfirmation;
