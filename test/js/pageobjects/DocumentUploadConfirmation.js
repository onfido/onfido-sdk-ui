import Base from './BasePage.js'

class DocumentUploadConfirmation extends Base{

  get makeSureClearDetailsMessage() { return this.$('div#onfido-mount div.gs_copied')}
  get redoBtn() { return this.$('.onfido-sdk-ui-Confirm-retake')}
  get confirmBtn() { return this.$('.onfido-sdk-ui-Confirm-btn-primary')}
  get errorTitleText() { return this.$('div#onfido-mount span.onfido-sdk-ui-Error-title-text')}
  get errorTitleIcon() { return this.$('div#onfido-mount span.onfido-sdk-ui-Error-title-icon-error')}
  get errorInstruction() { return this.$('div#onfido-mount p > span')}
}

export default DocumentUploadConfirmation;
