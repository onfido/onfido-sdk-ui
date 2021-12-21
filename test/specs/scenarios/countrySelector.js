import { assert } from 'chai'
import { Key } from 'selenium-webdriver'
import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'CountrySelector',
    'DocumentUpload',
    'BasePage',
    'Confirm',
  ],
}

export const countrySelectorScenarios = async (lang) => {
  describe(
    `COUNTRY SELECTOR scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        documentSelector,
        countrySelector,
        documentUpload,
        basePage,
        confirm,
      } = pageObjects
      const copy = basePage.copy(lang)
      const url = `${localhostUrl}?language=${lang}`

      const verifyInitialUIElements = async (copy) => {
        countrySelector.verifyTitle(copy)
        await countrySelector.verifySelectorLabel(copy)
        await countrySelector.verifyCountryFinderDisplayed()
        await countrySelector.verifySubmitDocumentBtnIsDisabled()
      }

      it('should not display country selection screen when passport document type selected', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await documentUpload.verifyPassportTitle(copy)
      })

      it("should display country selection screen for driver's license document type", async () => {
        driver.get(url)
        welcome.continueToNextStep()
        await documentSelector.clickOnDrivingLicenceIcon()
        await verifyInitialUIElements(copy)
      })

      it('should display country selection screen for identity card document type', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        await documentSelector.clickOnIdentityCardIcon()
        await verifyInitialUIElements(copy)
      })

      it('should skip country selection screen and successfully upload a document when only residence permit document type preselected', async () => {
        driver.get(`${url}&oneDoc=residence_permit`)
        welcome.continueToNextStep()
        await documentUpload.verifyFrontOfResidencePermitTitle(copy)
        await documentUpload.getUploadInput()
        documentUpload.upload('uk_driving_licence.png')
        await confirm.verifyCheckReadabilityMessage(copy)
        await confirm.verifyMakeSureResidencePermitMessage(copy)
        await confirm.clickConfirmButton()
        await documentUpload.verifyBackOfResidencePermitTitle(copy)
      })

      it('should skip country selection screen and successfully upload a document when multiple document types have country preset', async () => {
        driver.get(`${url}&multiDocWithPresetCountry=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnDrivingLicenceIcon()
        await documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
        await documentUpload.clickBackArrow()
        await documentSelector.clickOnIdentityCardIcon()
        await documentUpload.verifyFrontOfIdentityCardTitle(copy)
        await documentUpload.clickBackArrow()
        await documentSelector.clickOnResidencePermitIcon()
        await documentUpload.verifyFrontOfResidencePermitTitle(copy)
        await documentUpload.getUploadInput()
        documentUpload.upload('national_identity_card.jpg')
        await confirm.verifyCheckReadabilityMessage(copy)
        await confirm.verifyMakeSureResidencePermitMessage(copy)
        await confirm.clickConfirmButton()
        await documentUpload.verifyBackOfResidencePermitTitle(copy)
      })

      it("should show country selection screen for driver's license and national ID given invalid country code", async () => {
        driver.get(`${url}&multiDocWithInvalidPresetCountry=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnDrivingLicenceIcon()
        countrySelector.verifyTitle(copy)
        await countrySelector.clickBackArrow()
        await documentSelector.clickOnIdentityCardIcon()
        countrySelector.verifyTitle(copy)
        await countrySelector.selectSupportedCountry()
        await countrySelector.clickSubmitDocumentButton()
        await documentUpload.verifyFrontOfIdentityCardTitle(copy)
        await documentUpload.getUploadInput()
        documentUpload.upload('national_identity_card.jpg')
        await confirm.clickConfirmButton()
        await documentUpload.verifyBackOfIdentityCardTitle(copy)
      })

      it("should skip country selection screen and successfully upload document when only driver's license preselected with a valid country code", async () => {
        driver.get(`${url}&oneDocWithPresetCountry=true`)
        welcome.continueToNextStep()
        await documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
        await documentUpload.getUploadInput()
        documentUpload.upload('uk_driving_licence.png')
        await confirm.verifyCheckReadabilityMessage(copy)
        await confirm.verifyMakeSureDrivingLicenceMessage(copy)
        await confirm.clickConfirmButton()
        await documentUpload.verifyBackOfDrivingLicenceTitle(copy)
      })

      it("should show country selection screen with only driver's license preselected and showCountrySelection enabled", async () => {
        driver.get(`${url}&oneDocWithCountrySelection=true`)
        welcome.continueToNextStep()
        countrySelector.verifyTitle(copy)
        await countrySelector.verifySelectorLabel(copy)
        await countrySelector.verifyCountryFinderDisplayed()
        assert.isFalse(
          countrySelector.isErrorMessagePresent(),
          'Test failed: Fallback help message should not be displayed'
        )
        await countrySelector.verifySubmitDocumentBtnIsDisabled()
      })

      it('should show country selection screen when multiple documents enabled with boolean values (legacy config)', async () => {
        driver.get(`${url}&multiDocWithBooleanValues=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnIdentityCardIcon()
        countrySelector.verifyTitle(copy)
        await countrySelector.selectSupportedCountry()
        await countrySelector.clickSubmitDocumentButton()
        await documentUpload.verifyFrontOfIdentityCardTitle(copy)
        await documentUpload.getUploadInput()
        documentUpload.upload('national_identity_card.jpg')
        await confirm.clickConfirmButton()
        await documentUpload.verifyBackOfIdentityCardTitle(copy)
      })

      it('should go to document upload screen when a supported country is selected', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        await documentSelector.clickOnIdentityCardIcon()
        await countrySelector.selectSupportedCountry()
        await countrySelector.verifySubmitDocumentBtnIsEnabled()
        await countrySelector.clickSubmitDocumentButton()
      })

      it('should be able to select "Hong Kong" as a supported country option when searching with "香"', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        await documentSelector.clickOnIdentityCardIcon()
        await countrySelector.searchFor('香 ')
        await countrySelector.selectFirstOptionInDropdownMenu()
        await countrySelector.verifySubmitDocumentBtnIsEnabled()
      })

      it('should display "Country not found" message and error variant of help icon when searching for "xyz"', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        await documentSelector.clickOnIdentityCardIcon()
        await countrySelector.searchFor('xyz')
        await countrySelector.verifyCountryFinderNoResultsMessage(copy)
        countrySelector.countryFinderInput().sendKeys(Key.TAB)
        await countrySelector.verifyCountryNotFoundErrorMessageDisplayed()
        await countrySelector.verifySubmitDocumentBtnIsDisabled()
      })
    }
  )
}
