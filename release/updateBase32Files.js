const { getDataFromBase32File } = require('./util/helpers') 
const { replaceInFile, appendToFile } = require('./util/file')
const { RELEASE_VERSION, BASE_32_VERSION } = process.env

const updateBase32Files = async () => {
  const [month, day, year] = new Date().toLocaleDateString().split('/')
  const date = [year, month, day].join('-')

  await replaceInFile(
    'webpack.config.babel.js',
    /BASE_32_VERSION\s*: '([A-Z]+)'/,
    `BASE_32_VERSION: '${BASE_32_VERSION}'`
  )

  await replaceInFile(
    'release/githubActions/workflows.config',
    /BASE_32_VERSION\s*=([A-Z]+)/,
    `BASE_32_VERSION=${BASE_32_VERSION}`
  )

  const data = await getDataFromBase32File()
  const hashExists = data.find((i) => i.hash === BASE_32_VERSION)

  if(hashExists){
    const regex = new RegExp(`\\| ${BASE_32_VERSION}\\s+\\|.*?\\| (.*?) \\|`, 'g')
    await replaceInFile(
      'release/BASE_32_VERSION_MAPPING.md',
      regex,
      (all) => all
        .replace(hashExists.date, date)
        .replace(hashExists.releaseVersion, RELEASE_VERSION)
    )
  } else {
    await appendToFile(
      'release/BASE_32_VERSION_MAPPING.md',
      `| ${BASE_32_VERSION}              | ${RELEASE_VERSION}           | ${date} |                                                                                                                                                                                                                      |`
    )
  }
}

;(async () => {
  await updateBase32Files()
})()
