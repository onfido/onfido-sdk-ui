const yn = require('yn')
const readline = require('readline')

const processes = require('./processes')

const { exitRelease } = processes

const question = query => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(resolve => rl.question(`\n${query} (y/n) `, answer => {
    const answerAsBoolean = yn(answer) || false
    resolve(answerAsBoolean)
    rl.close()
  }))
}

const getNumberInput = query => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(`\n${query}`, answer => {
    const answerAsNumber = parseInt(answer, 10)
    rl.close()
    resolve(answerAsNumber)
  }))
  .then((answerAsNumber) => {
    if (!answerAsNumber) {
      console.log(`❌ That was not a valid integer. Please type a valid integer 🙄 \n`)
      return getNumberInput(query)
    }
    return answerAsNumber
  })
}

const proceedYesNo = async query => {
  const ok = await question(query || 'Is this correct?')
  if (ok) {
    console.log('✅ Great!\n')
  } else {
    console.error('❌ Things were not correct. I don\'t know how to automate this case 🤖😞')
    exitRelease()
  }
}

module.exports = {
  question,
  getNumberInput,
  proceedYesNo
}
