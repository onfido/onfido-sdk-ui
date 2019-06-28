import AxeBuilder from 'axe-webdriverjs'
const expect = require('chai').expect
import { Key } from 'selenium-webdriver'

const disabledAccessibilityRules = [
  'html-has-lang',
  'landmark-one-main',
  'region'
]

const analyzeAccessibility = (driver) =>
  new Promise((resolve, reject) => {
    AxeBuilder(driver).disableRules(disabledAccessibilityRules).analyze((error, results) => {
      if (error) {
        return reject(console.log(`Accessibility test error: ${error}`))
      }
      return resolve(results)
    }
  )})

const formatViolationMessages = (violations) =>
  violations.map(
    violation =>
      `\r\n- Rule ID: ${violation.id}
      \r  ${violation.help} (${violation.nodes.length} elements affected)
      \r  Help: ${violation.helpUrl}\r\n`).join('')

const formatAccessibilityViolations = (violations) =>
  `${violations.length} violations found: ${formatViolationMessages(violations)}`

export const runAccessibilityTest = async (driver) => {
  const results = await analyzeAccessibility(driver)
  const readableErrorMessage = formatAccessibilityViolations(results.violations)
  expect(results.violations.length, readableErrorMessage).to.equal(0)
}

export const testFocusManagement = async (element, driver) => {
  const focusedElement = driver.switchTo().activeElement()
  await expect(element.className).to.equal(focusedElement.className);
}

// This is a PoC function. It will only work if there is only
// one focusable element on the page (apart from the one that
// has initial focus through focus management)
// TODO: For screens where multiple focusable elements are present
// Add an helper to be able to tab through the elements until the right element is found
export const elementCanReceiveFocus = async (element, driver) => {
  element.sendKeys(Key.SPACE)
  await expect(element.className).to.equal(driver.switchTo().activeElement().className);
}
