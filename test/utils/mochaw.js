import mocha from 'mocha'
import { By, until, WebDriver, WebElement } from 'selenium-webdriver'
import { expect } from 'chai'

WebElement.prototype.nativeClick = WebElement.prototype.click
WebElement.prototype.click = async function (useSeleniumNativeClick = false) {
  if (useSeleniumNativeClick) {
    // Escape hatch for when we need to use Selenium native click directly
    return this.nativeClick()
  }

  // We want to always use our custom implementation as Selenium's native click function sometimes fails
  const driver = new WebDriver()
  await driver.wait(until.elementIsVisible(this))
  await driver.wait(until.elementIsEnabled(this))
  return this.nativeClick()
}

const waitAndFindElement = (driver) => (selector) => {
  const locator = By.css(selector)
  return driver.findElement(async () => {
    await driver.wait(until.elementLocated(locator))
    const element = driver.findElement(locator)
    return element
  })
}

export const click = (driver) => async (element) => {
  await driver.wait(until.elementIsVisible(element))
  await driver.wait(until.elementIsEnabled(element))
  return element.nativeClick()
}

//It wrapper of async functions
const asyncTestWrap = (fn) => (done) => {
  fn()
    .then(() => done())
    .catch((error) => {
      console.error('Async test exception')
      done(error)
    })
}

const wrapDescribeFunction = ({ pageObjects }, fn) =>
  function () {
    const driver = this.parent.ctx.driver
    const waitAndFind = waitAndFindElement(driver)
    if (pageObjects) {
      pageObjects = instantiate(...pageObjects)(driver, waitAndFind)
    }
    fn.call(this, { driver, pageObjects, waitAndFind }, this)
  }

const buildDescribeArgs = (args) => {
  const [description, second] = args
  const [fn] = args.reverse()
  const options = fn === second ? {} : second
  return [description, wrapDescribeFunction(options, fn)]
}

export const describe = (...args) => mocha.describe(...buildDescribeArgs(args))
describe.only = (...args) => mocha.describe.only(...buildDescribeArgs(args))
describe.skip = (...args) => mocha.describe.skip(...buildDescribeArgs(args))

export const it = (description, fn) => mocha.it(description, asyncTestWrap(fn))
it.only = (description, fn) => mocha.it.only(description, asyncTestWrap(fn))
it.skip = (description, fn) => mocha.it.skip(description, asyncTestWrap(fn))

const uncapitalize = (str1) => str1.charAt(0).toLowerCase() + str1.slice(1)

const instantiateFile = (fileName) => (...args) =>
  new (require(`../pageobjects/${fileName}`).default)(...args) // eslint-disable-line @typescript-eslint/no-var-requires

export const instantiate = (...classFiles) => (...args) =>
  classFiles.reduce(
    (obj, classFile) => ({
      ...obj,
      [uncapitalize(classFile)]: instantiateFile(classFile)(...args),
    }),
    {}
  )

export const locale = (lang = 'en_US') =>
  require(`../../src/locales/${lang}/${lang}.json`)

export const verifyElementCopy = async (element, copy) => {
  const elementText = await element.getText()
  expect(elementText).to.equal(copy)
}
