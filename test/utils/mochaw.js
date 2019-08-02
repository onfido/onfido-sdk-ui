import mocha from 'mocha';
const {By} = require('selenium-webdriver');
const expect = require('chai').expect

const $driver = driver => selector =>
  driver.findElement(By.css(selector))

//It wrapper of async functions
const asyncTestWrap = fn => done => {
  fn()
  .then(()=>done())
  .catch( error => {
    console.log("Async test exception");
    done(error)
  });
}

const wrapDescribeFunction = ({screens},fn) => function () {
  const driver = this.parent.ctx.driver
  const $ = $driver(driver)
  if (screens) {
    screens = instantiate(...screens)(driver,$)
  }
  fn.call(this,{driver,$,screens},this)
}

export const describe = (...args) => {
  const [description, second] = args
  const [fn] = args.reverse()
  const options = fn === second ? {} : second
  return mocha.describe(description, wrapDescribeFunction(options,fn))
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
  await element.isDisplayed()
}
