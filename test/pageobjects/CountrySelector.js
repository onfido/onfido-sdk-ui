import { Key } from 'selenium-webdriver'
import { assert } from 'chai'
import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

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

  async countryFinderFirstResult() {
    return this.$(
      '[data-onfido-qa="countrySelector"] #country-search__option--0'
    )
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
    this.driver.sleep(250)
    this.countryFinderInput().sendKeys(Key.DOWN)
    this.countryFinderFirstResult().click()
  }

  async searchFor(searchQuery) {
    this.countryFinderInput().sendKeys(searchQuery)
  }

  async clickSubmitDocumentButton() {
    this.submitDocumentBtn().click()
  }

  async verifyTitle(copy) {
    verifyElementCopy(this.title(), copy.country_select.title)
  }

  async verifySelectorLabel(copy) {
    verifyElementCopy(this.selectorLabel(), copy.country_select.search.label)
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

  async isErrorMessagePresent() {
    const classes = this.containerArea().getAttribute('class').split(' ')
    return classes.includes('onfido-sdk-ui-CountrySelector-errorContainer')
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
