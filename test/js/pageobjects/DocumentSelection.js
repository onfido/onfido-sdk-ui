import Base from './BasePage.js'

class DocumentSelection extends Base{
    get title() { return this.$('.onfido-sdk-ui-Title-titleSpan'); }
    get passport() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-passport')}

    copy = (lang="en") =>
      require(`../../../src/locales/${lang}.json`)["document_selector"]["identity"]
}

export default DocumentSelection;
