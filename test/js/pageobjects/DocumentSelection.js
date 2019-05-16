import Base from './BasePage.js'
const locale = (lang="en") => require(`../../../src/locales/${lang}.json`)

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

    copy(lang) { return locale(lang) }

    verifyDocumentSelectionScreenTitle() {
        const documentSelectionScreenStrings = documentSelection.copy(lang).document_selector.identity
        const documentSelectionTitleText = title.getText()
        expect(documentSelectionTitleText).to.equal(documentSelectionScreenStrings.title)
        documentSelection.title.isDisplayed()
    }

    verifyDocumentSelectionScreenSubtitle() {
        const documentSelectionScreenStrings = documentSelection.copy(lang).document_selector.identity
        const documentSelectionSubtitleText = documentSelection.subtitle.getText()
        expect(documentSelectionSubtitleText).to.equal(documentSelectionScreenStrings.hint)
        documentSelection.subtitle.isDisplayed()
    }

    verifyDocumentSelectionScreenDocumentsLabels() {
        const documentTypesStrings = documentSelection.copy(lang)
        const documentSelectionPassportLabelText = documentSelection.documentSelectionLabel.getText()
        expect(documentSelectionPassportLabelText).to.equal(documentTypesStrings.passport)
        documentSelection.documentSelectionLabel.isDisplayed()

        const drivingLicenceLabelText = documentSelection.drivingLicenceLabel.getText()
        expect(drivingLicenceLabelText).to.equal(documentTypesStrings.driving_licence)
        documentSelection.drivingLicenceLabel.isDisplayed()

        const identityCardLabelText = documentSelection.identityCardLabel.getText()
        expect(identityCardLabelText).to.equal(documentTypesStrings.national_identity_card)
        documentSelection.identityCardLabel.isDisplayed()
    }

    verifyDocumentSelectionScreenDocumentsHints() {
        const documentSelectionScreenStrings = documentSelection.copy(lang).document_selector.identity
        const documentSelectionPassportHintText = documentSelection.documentSelectionHint.getText()
        expect(documentSelectionPassportHintText).to.equal(documentSelectionScreenStrings.passport_hint)
        documentSelection.documentSelectionHint.isDisplayed()

        const drivingLicenceHintText = documentSelection.drivingLicenceHint.getText()
        expect(drivingLicenceHintText).to.equal(documentSelectionScreenStrings.driving_licence_hint)
        documentSelection.drivingLicenceHint.isDisplayed()

        const identityCardHintText = documentSelection.identityCardHint.getText()
        expect(identityCardHintText).to.equal(documentSelectionScreenStrings.national_identity_card_hint)
        documentSelection.identityCardHint.isDisplayed()
    }

    verifyDocumentSelectionScreenDocumentsIcons() {
        documentSelection.passportIcon.isDisplayed()
        documentSelection.drivingLicenceIcon.isDisplayed()
        documentSelection.identityCardIcon.isDisplayed()
    }
}

export default DocumentSelection;
