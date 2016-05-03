import xhr from '../connect/xhr';

export const auth = (key) => {
  return new Promise((resolve, reject) => {
    console.log(`authorising with key: ${key}`)
    params = {key, resolve, reject}
    xhr.auth(params)
  })
}
