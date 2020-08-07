import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import { Key } from 'selenium-webdriver'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'CountrySelector',
    'DocumentUpload',
    'BasePage',
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
      } = pageObjects
      const copy = basePage.copy(lang)
      const countrySelectorCopy = copy.country_selection
      const url = `${localhostUrl}?language=${lang}`

      const verifyInitialUIElements = async (countrySelectorCopy) => {
        countrySelector.verifyTitle(countrySelectorCopy)
        countrySelector.verifySelectorLabel(countrySelectorCopy)
        countrySelector.verifyCountryFinderDisplayed()
        countrySelector.verifyFallbackHelpMessageDisplayed()
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
        verifyInitialUIElements(countrySelectorCopy)
      })

      it('should display country selection screen for identity card document type', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        verifyInitialUIElements(countrySelectorCopy)
      })

      it('should go to document upload screen when a supported country is selected', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        countrySelector.selectSupportedCountry()
        countrySelector.verifyFallbackHelpMessageDisplayed()
        countrySelector.verifySubmitDocumentBtnIsEnabled()
        countrySelector.clickSubmitDocumentButton()
      })

      it('should display "Country not found" message and error variant of help icon when searching for "xyz"', async () => {
        driver.get(url)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        countrySelector.searchFor('xyz')
        countrySelector.verifyCountryFinderNoResultsMessage(countrySelectorCopy)
        countrySelector.countryFinderInput().sendKeys(Key.TAB)
        countrySelector.verifyCountryNotFoundErrorMessageDisplayed()
        countrySelector.verifySubmitDocumentBtnIsDisabled()
      })
    }
  )
}
