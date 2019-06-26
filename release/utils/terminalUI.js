const chalk = require('chalk')

const welcomeMessage = () => {
  console.log('Beep boop. Release Bot at your service. Let\'s release the SDK 🤖👋')
}

const stepTitle = message => {
  console.log()
  console.log(chalk.magenta('~'.repeat(message.length + 4)))
  console.log(chalk.magenta(`| ${message} |`))
  console.log(chalk.magenta('~'.repeat(message.length + 4)))
  console.log()
}

const somethingWentWrong = (cmd) => {
  console.error('❌ Oops. Something went wrong with that last command! 🤖😞 \n')
  console.error(`❌ The command was: ${chalk.magenta(cmd)} \n`)
}

module.exports = {
  welcomeMessage,
  stepTitle,
  somethingWentWrong
}
