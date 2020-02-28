import mocha from 'mocha'
const { By, until } = require('selenium-webdriver')
const expect = require('chai').expect

const waitAndFindElement = driver => selector => {
  const locator = By.css(selector)
  return driver.findElement(async () => {
    await driver.wait(until.elementLocated(locator))
    return driver.findElement(locator)
  })
}

export const click = (driver) => async (element) => {
  await driver.wait(until.elementIsVisible(element))
  await driver.wait(until.elementIsEnabled(element))
  return element.click()
}

//It wrapper of async functions
const asyncTestWrap = (fn) => done => {
  fn()
  .then(()=>done())
  .catch( error => {
    console.error("Async test exception")
    done(error)
  });
}

const wrapDescribeFunction = ({ pageObjects }, fn) => function() {
  const driver = this.parent.ctx.driver
  const waitAndFind = waitAndFindElement(driver)
  const clickWhenClickable = click(driver)
  if (pageObjects) {
    pageObjects = instantiate(...pageObjects)(driver, waitAndFind, clickWhenClickable)
  }
  fn.call(this, { driver, pageObjects, waitAndFind, clickWhenClickable }, this)
}

export const describe = (...args) => {
  const [description, second] = args
  const [fn] = args.reverse()
  const options = fn === second ? {} : second
  return mocha.describe(description, wrapDescribeFunction(options, fn))
}

export const it = (description, fn) =>
  mocha.it(description, asyncTestWrap(fn))

const uncapitalize = str1 =>
  str1.charAt(0).toLowerCase() + str1.slice(1);

const instantiateFile = fileName => (...args) =>
  new (require(`../pageobjects/${fileName}`).default)(...args)

export const instantiate = (...classFiles) => (...args) =>
  classFiles.reduce(
    (obj,classFile) => ({
      ...obj,
      [uncapitalize(classFile)]: instantiateFile(classFile)(...args)
    })
    ,{})

export const locale = (lang="en") => require(`../../src/locales/${lang}.json`)

export const verifyElementCopy = async (element, copy) => {
  const elementText = await element.getText()
  await expect(elementText).to.equal(copy)
}
