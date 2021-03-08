import { assert } from 'chai'
import { verifyElementCopy } from '../utils/mochaw'
import { By } from 'selenium-webdriver'
import BasePage from './BasePage.js'

class UserConsent extends BasePage {
  async consentFrameTitle() {
    return this.$('[data-onfido-qa="userConsentFrameWrapper"]> h1')
  }

  async declineBtn() {
    return this.$('[data-onfido-qa="userConsentBtnSecondary"]')
  }
  async acceptBtn() {
    return this.$('[data-onfido-qa="userConsentBtnPrimary"]')
  }

  async verifyFrameTitle() {
    verifyElementCopy(
      this.consentFrameTitle(),
      "Onfido's privacy statement and Terms of Service"
    )
  }

  async verifyAcceptButton(copy) {
    verifyElementCopy(this.acceptBtn(), copy.user_consent.button_primary)
  }

  async verifyDeclineButton(copy) {
    verifyElementCopy(this.declineBtn(), copy.user_consent.button_secondary)
  }

  async acceptUserConsent() {
    this.acceptBtn().click()
  }

  async declineUserConsent() {
    this.declineBtn().click()
  }

  // Decline Modal

  async userConsentDeclineModalTitle() {
    return this.$('[data-onfido-qa="userConsentDeclineModalContent"]> h2')
  }

  async userConsentDeclineModalPrimaryBtn() {
    return this.$('[data-onfido-qa="userConsentDeclineModalBtnPrimary"]')
  }

  async userConsentDeclineModalSecondaryBtn() {
    return this.$('[data-onfido-qa="userConsentDeclineModalBtnSecondary"]')
  }

  async userConsentDeclineModalPrimaryBtnClick() {
    this.userConsentDeclineModalPrimaryBtn().click()
  }

  async userConsentDeclineModalSecondaryBtnClick() {
    this.userConsentDeclineModalSecondaryBtn().click()
  }

  async verifyUserConsentDeclineModalTitle(copy) {
    verifyElementCopy(
      this.userConsentDeclineModalTitle(),
      copy.user_consent.prompt.no_consent_title
    )
  }

  async verifyUserConsentDeclineModalPrimaryBtn(copy) {
    verifyElementCopy(
      this.userConsentDeclineModalPrimaryBtn(),
      copy.user_consent.prompt.button_primary
    )
  }

  async verifyUserConsentDeclineModalSecondaryBtn(copy) {
    verifyElementCopy(
      this.userConsentDeclineModalSecondaryBtn(),
      copy.user_consent.prompt.button_secondary
    )
  }

  async userConsentModalIsOpen() {
    return this.userConsentDeclineModalTitle().isDisplayed()
  }

  async userConsentModalIsClosed() {
    const modalTitle = this.driver.findElements(
      By.css('[data-onfido-qa="userConsentDeclineModalContent"]> h2')
    )
    assert.isTrue(
      modalTitle.length === 0,
      'Test Failed: User Consent Decline Modal should not be displayed'
    )
  }

  async isConsentScreenUnmounted() {
    const consentScreenTitle = this.driver.findElements(
      By.css('[data-onfido-qa="userConsentFrameWrapper"]> h1')
    )

    assert.isTrue(
      consentScreenTitle.length === 0,
      'Test Failed: User Consent Consent Screen should not be displayed'
    )
  }
}

export default UserConsent
