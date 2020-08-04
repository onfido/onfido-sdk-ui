import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { Key } from 'selenium-webdriver'
const assert = require('chai').assert

class CountrySelector extends BasePage {
  async selectorLabel() {
    return this.$('.onfido-sdk-ui-CountrySelector-label')
  }

  async fallbackHelp() {
    return this.$('.onfido-sdk-ui-CountrySelector-fallbackHelp')
  }

  async helpIcon() {
    return this.$('.onfido-sdk-ui-CountrySelector-helpIcon')
  }

  async errorIcon() {
    return this.$('.onfido-sdk-ui-CountrySelector-errorIcon')
  }

  async countryFinderInput() {
    return this.$('[data-onfido-qa="countrySelector"] .autocomplete__input')
  }

  async countryFinderNoResults() {
    return this.$(
      '[data-onfido-qa="countrySelector"] .autocomplete__option--no-results'
    )
  }

  async submitDocumentBtn() {
    return this.$('[data-onfido-qa="countrySelectorNextStep"]')
  }

  async containerArea() {
    return this.$('.onfido-sdk-ui-CountrySelector-container')
  }

  async selectSupportedCountry() {
    this.searchFor('malaysia')
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

  async verifyCountryFinderNoResultsMessage(countrySelectorCopy) {
    verifyElementCopy(this.countryFinderNoResults(), countrySelectorCopy.error)
  }

  async verifyFallbackHelp(countrySelectorCopy) {
    verifyElementCopy(this.fallbackHelp(), countrySelectorCopy.fallback)
  }

  async verifyCountryNotFoundError(countrySelectorCopy) {
    verifyElementCopy(this.fallbackHelp(), countrySelectorCopy.error)
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
