const browserstack = require('browserstack-local');

export const createBrowserStackLocal = async options => new Promise((resolve, reject) => {
  const bs_local = new browserstack.Local();
  bs_local.start(
    options,
    error => {
      if (error) reject(error)
      console.log("Started BrowserStackLocal");
      resolve(bs_local)
    });
})

export const stopBrowserstackLocal = bsLocal =>
  new Promise((resolve, reject) => {
    bsLocal.stop( error => {
      if (error) reject(error)
      else resolve()
    })
  })
