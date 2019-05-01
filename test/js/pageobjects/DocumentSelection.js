import Base from './BasePage.js'

class DocumentSelection extends Base{
    getTitle() { return this.$('.onfido-sdk-ui-Title-titleSpan'); }
    getPassport() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-passport')}

    strings = (lang="en") =>
      require(`../../../src/locales/${lang}.json`)["document_selector"]["identity"]
}

export default DocumentSelection;
