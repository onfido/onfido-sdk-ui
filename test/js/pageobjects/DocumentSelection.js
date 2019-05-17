import Base from './BasePage.js'
import {locale} from '../utils/mochaw'

class DocumentSelection extends Base{
    getTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan'); }
    getPassport() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-passport')}
    get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
    get subtitle() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}
    get passportIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-passport')}
    get documentSelectionLabel() { return this.$('.onfido-sdk-ui-DocumentSelector-label')}
    get documentSelectionHint() { return this.$('.onfido-sdk-ui-DocumentSelector-hint')}
    get drivingLicenceIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-driving-licence')}
    get drivingLicenceLabel() { return this.$('.onfido-sdk-ui-DocumentSelector-option:nth-child(2) .onfido-sdk-ui-DocumentSelector-label')}
    get drivingLicenceHint() { return this.$('.onfido-sdk-ui-DocumentSelector-option:nth-child(2) .onfido-sdk-ui-DocumentSelector-hint')}
    get identityCardIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-national-identity-card')}
    get identityCardLabel() { return this.$('.onfido-sdk-ui-DocumentSelector-option:nth-child(3) .onfido-sdk-ui-DocumentSelector-label')}
    get identityCardHint() { return this.$('.onfido-sdk-ui-DocumentSelector-option:nth-child(3) .onfido-sdk-ui-DocumentSelector-hint')}

    /* eslint-disable no-undef */
    copy(lang) { return locale(lang) }

    verifyDocumentSelectionScreenTitle() {
        const documentSelectionScreenStrings = copy(lang).document_selector.identity
        const documentSelectionTitleText = title.getText()
        expect(documentSelectionTitleText).to.equal(documentSelectionScreenStrings.title)
        title.isDisplayed()
    }

    verifyDocumentSelectionScreenSubtitle() {
        const documentSelectionScreenStrings = copy(lang).document_selector.identity
        const documentSelectionSubtitleText = subtitle.getText()
        expect(documentSelectionSubtitleText).to.equal(documentSelectionScreenStrings.hint)
        subtitle.isDisplayed()
    }

    verifyDocumentSelectionScreenDocumentsLabels() {
        const documentTypesStrings = copy(lang)
        const documentSelectionPassportLabelText = documentSelectionLabel.getText()
        expect(documentSelectionPassportLabelText).to.equal(documentTypesStrings.passport)
        documentSelectionLabel.isDisplayed()

        const drivingLicenceLabelText = drivingLicenceLabel.getText()
        expect(drivingLicenceLabelText).to.equal(documentTypesStrings.driving_licence)
        drivingLicenceLabel.isDisplayed()

        const identityCardLabelText = identityCardLabel.getText()
        expect(identityCardLabelText).to.equal(documentTypesStrings.national_identity_card)
        identityCardLabel.isDisplayed()
    }

    verifyDocumentSelectionScreenDocumentsHints() {
        const documentSelectionScreenStrings = copy(lang).document_selector.identity
        const documentSelectionPassportHintText = documentSelectionHint.getText()
        expect(documentSelectionPassportHintText).to.equal(documentSelectionScreenStrings.passport_hint)
        documentSelectionHint.isDisplayed()

        const drivingLicenceHintText = drivingLicenceHint.getText()
        expect(drivingLicenceHintText).to.equal(documentSelectionScreenStrings.driving_licence_hint)
        drivingLicenceHint.isDisplayed()

        const identityCardHintText = identityCardHint.getText()
        expect(identityCardHintText).to.equal(documentSelectionScreenStrings.national_identity_card_hint)
        identityCardHint.isDisplayed()
    }

    verifyDocumentSelectionScreenDocumentsIcons() {
        passportIcon.isDisplayed()
        drivingLicenceIcon.isDisplayed()
        identityCardIcon.isDisplayed()
    }
}

export default DocumentSelection;
