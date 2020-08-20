import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { Key } from 'selenium-webdriver'
const assert = require('chai').assert

class CountrySelector extends BasePage {
  async selectorLabel() {
    return this.$('.onfido-sdk-ui-CountrySelector-label')
  }

  async fallbackMessageText() {
    return this.$('.onfido-sdk-ui-CountrySelector-fallbackText')
  }

  async helpIcon() {
    return this.$('.onfido-sdk-ui-CountrySelector-helpIcon')
  }

  async errorIcon() {
    return this.$('.onfido-sdk-ui-CountrySelector-errorIcon')
  }

  async countryFinderInput() {
    return this.$('[data-onfido-qa="countrySelector"] #country-search')
  }

  async countryFinderNoResults() {
    return this.$(
      '[data-onfido-qa="countrySelector"] #country-search__listbox li'
    )
  }

  async submitDocumentBtn() {
    return this.$('[data-onfido-qa="countrySelectorNextStep"]')
  }

  async containerArea() {
    return this.$('.onfido-sdk-ui-CountrySelector-container')
  }

  async selectSupportedCountry() {
    this.searchFor('france')
    this.selectFirstOptionInDropdownMenu()
  }
  async selectFirstOptionInDropdownMenu() {
    this.countryFinderInput().sendKeys(Key.DOWN)
    this.countryFinderInput().sendKeys(Key.ENTER)
  }

  async searchFor(searchQuery) {
    this.countryFinderInput().sendKeys(searchQuery)
  }

  async clickSubmitDocumentButton() {
    this.submitDocumentBtn().click()
  }

  async verifyTitle(countrySelectorCopy) {
    verifyElementCopy(this.title(), countrySelectorCopy.title)
  }

  async verifySelectorLabel(countrySelectorCopy) {
    verifyElementCopy(this.selectorLabel(), countrySelectorCopy.search)
  }

  async verifyCountryFinderDisplayed() {
    assert.isTrue(
      this.countryFinderInput().isDisplayed(),
      'Test Failed: Country finder input should be displayed'
    )
  }

  async verifyCountryFinderNoResultsMessage() {
    assert.isTrue(
      this.countryFinderNoResults().isDisplayed(),
      'Test Failed: Fallback help message should be displayed'
    )
  }

  async verifyFallbackHelpMessageDisplayed() {
    assert.isTrue(
      this.fallbackMessageText().isDisplayed(),
      'Test Failed: Fallback help message should be displayed'
    )
    assert.isTrue(
      this.helpIcon().isDisplayed(),
      'Test Failed: Fallback help icon should be displayed'
    )
  }

  async verifyCountryNotFoundErrorMessageDisplayed() {
    assert.isTrue(
      this.fallbackMessageText().isDisplayed(),
      'Test Failed: Fallback error message should be displayed'
    )
    assert.isTrue(
      this.errorIcon().isDisplayed(),
      'Test Failed: Fallback error icon should be displayed'
    )
  }

  async verifySubmitDocumentBtnIsDisabled() {
    assert.isFalse(
      this.submitDocumentBtn().isEnabled(),
      'Test Failed: Submit Document button should be disabled'
    )
  }

  async verifySubmitDocumentBtnIsEnabled() {
    assert.isTrue(
      this.submitDocumentBtn().isEnabled(),
      'Test Failed: Submit Document button should not be disabled'
    )
  }
}

export default CountrySelector
