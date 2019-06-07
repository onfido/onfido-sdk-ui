import mocha from 'mocha';
const {By, until} = require('selenium-webdriver');
const expect = require('chai').expect

const $driver = driver => selector => {
  driver.wait(
    until.stalenessOf(
      driver.findElement(By.css(selector))
    ),
    10000
  ).then(driver.findElement(By.css(selector)))
  .catch(error => {
    console.log(error)
  })
  return driver.findElement(By.css(selector))
}

//It wrapper of async functions
const asyncTestWrap = fn => done => {
  fn()
      .then(()=>done())
      .catch( error => {
        console.log("Async test exception");
        done(error)
      });
}

const wrapDescribeFunction = ({pageObjects},fn) => function () {
  const driver = this.parent.ctx.driver
  const $ = $driver(driver)
  if (pageObjects){
    pageObjects = instantiate(...pageObjects)(driver,$)
  }
  fn.call(this,{driver,$,pageObjects},this)
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

export const locale = (lang="en") => require(`../../../src/locales/${lang}.json`)

export const verifyElementCopy = async (element, copy) => {
  try {
    const elementText = await element.getText()
    console.log(elementText + '<---- this is element text')

    await expect(elementText).to.equal(copy)
    await element.isDisplayed()
  } catch (error) {
    //console.log('CATCH CATCH', error)
      return false
  }
}

// console.log('Looking for an element')
//     await element.getText().then(function (elementText){
//     expect(elementText).to.equal(copy)
//     element.isDisplayed()
//     })