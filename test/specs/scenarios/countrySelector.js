import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import { Key } from 'selenium-webdriver'
const assert = require('chai').assert

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
        countrySelector.verifySelectorLabel(copy)
        countrySelector.verifyCountryFinderDisplayed()
        countrySelector.verifySubmitDocumentBtnIsDisabled()
      }

      it('should not display country selection screen when passport document type selected', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        documentUpload.verifyPassportTitle(copy)
      })

      it("should display country selection screen for driver's license document type", async () => {
        driver.get(url)
        welcome.continueToNextStep()
        documentSelector.clickOnDrivingLicenceIcon()
        verifyInitialUIElements(copy)
      })

      it('should display country selection screen for identity card document type', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        verifyInitialUIElements(copy)
      })

      it('should skip country selection screen and upload a document when only residence permit document type preselected', async () => {
        driver.get(`${url}&oneDoc=residence_permit`)
        welcome.continueToNextStep()
        documentUpload.verifyFrontOfResidencePermitTitle(copy)
        documentUpload.getUploadInput()
        documentUpload.upload('uk_driving_licence.png')
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSureResidencePermitMessage(copy)
        confirm.clickConfirmButton()
        documentUpload.verifyBackOfResidencePermitTitle(copy)
      })

      it("should be able to show country selection screen with a preselected driver's license document type", async () => {
        driver.get(`${url}&oneDocWithCountrySelection=true`)
        welcome.continueToNextStep()
        countrySelector.verifyTitle(copy)
        countrySelector.verifySelectorLabel(copy)
        countrySelector.verifyCountryFinderDisplayed()
        assert.isFalse(
          countrySelector.isErrorMessagePresent(),
          'Test failed: Fallback help message should not be displayed'
        )
        countrySelector.verifySubmitDocumentBtnIsDisabled()
      })

      it('should go to document upload screen when a supported country is selected', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        countrySelector.selectSupportedCountry()
        countrySelector.verifySubmitDocumentBtnIsEnabled()
        countrySelector.clickSubmitDocumentButton()
      })

      it('should be able to select "Hong Kong" as a supported country option when searching with "香"', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        countrySelector.searchFor('香 ')
        countrySelector.selectFirstOptionInDropdownMenu()
        countrySelector.verifySubmitDocumentBtnIsEnabled()
      })

      it('should display "Country not found" message and error variant of help icon when searching for "xyz"', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        countrySelector.searchFor('xyz')
        countrySelector.verifyCountryFinderNoResultsMessage(copy)
        countrySelector.countryFinderInput().sendKeys(Key.TAB)
        countrySelector.verifyCountryNotFoundErrorMessageDisplayed()
        countrySelector.verifySubmitDocumentBtnIsDisabled()
      })
    }
  )
}
