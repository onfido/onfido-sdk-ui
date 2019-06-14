import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class DocumentSelection extends Base{
    getTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan'); }
    getPassport() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-passport')}
    get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
    get subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
    get passportIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-passport')}
    get documentSelectionLabel() { return this.$('.onfido-sdk-ui-DocumentSelector-label')}
    get documentSelectionHint() { return this.$('.onfido-sdk-ui-DocumentSelector-hint')}
    get drivingLicenceIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-driving-licence')}
    get drivingLicenceLabel() { return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-label')}
    get drivingLicenceHint() { return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-hint')}
    get identityCardIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-national-identity-card')}
    get identityCardLabel() { return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-label')}
    get identityCardHint() { return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-hint')}

    copy(lang) { return locale(lang) }

    verifyDocumentSelectionScreenTitle(copy) {
        const documentSelectionScreenStrings = copy.document_selector.identity
        verifyElementCopy(this.title, documentSelectionScreenStrings.title)
    }

    verifyDocumentSelectionScreenSubtitle(copy) {
        const documentSelectionScreenStrings = copy.document_selector.identity
        verifyElementCopy(this.subtitle, documentSelectionScreenStrings.hint)
    }

    verifyDocumentSelectionScreenDocumentsLabels(copy) {
        const documentTypesStrings = copy.document_selector.identity
        verifyElementCopy(this.documentSelectionLabel, documentTypesStrings.passport)
        verifyElementCopy(this.drivingLicenceLabel, documentTypesStrings.driving_licence)
        verifyElementCopy(this.identityCardLabel, documentTypesStrings.national_identity_card)
    }

    verifyDocumentSelectionScreenDocumentsHints(copy) {
        const documentSelectionScreenStrings = copy.document_selector.identity
        verifyElementCopy(this.documentSelectionHint, documentSelectionScreenStrings.passport_hint)
        verifyElementCopy(this.drivingLicenceHint, documentSelectionScreenStrings.driving_licence_hint)
        verifyElementCopy(this.identityCardHint, documentSelectionScreenStrings.national_identity_card_hint)
    }

    verifyDocumentSelectionScreenDocumentsIcons() {
        verifyElementCopy(this.passportIcon)
        verifyElementCopy(this.drivingLicenceIcon)
        verifyElementCopy(this.identityCardIcon)
    }
}

export default DocumentSelection;
