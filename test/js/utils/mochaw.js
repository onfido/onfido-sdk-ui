import mocha from 'mocha';
const {By} = require('selenium-webdriver');

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

const wrapDescribeFunction = fn => function (...args) {
  const driver = this.parent.ctx.driver
  const $ = $driver(driver)
  fn.call(this,driver,$,this,...args)
}

export const describe = (description, fn) =>
  mocha.describe(description, wrapDescribeFunction(fn))

export const it = (description, fn) =>
  mocha.it(description, asyncTestWrap(fn))

const instantiateClasses = (...classes) => (...args) =>
    classes.map(aClass=>console.log(aClass) || new aClass(...args))

export const instantiate = (...classFiles) =>
  instantiateClasses(...classFiles.map(
    classFile=>require(`../pageobjects/${classFile}`).default
  ))
