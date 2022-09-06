import { Command } from 'commander'
import { generateChangelog } from './src/generateChangeLog'
import { compareLanguageVersions } from './src/compareLanguageVersions'
import { compareAgainstBaseLanguage } from './src/compareAgainstBaseLanguage'
import { findEmptyTranslations } from './src/findEmptyTranslations'
import { download } from './src/download'

const program = new Command()

program
  .name('websdk')
  .description('Utility tools for WebSDK contributers')
  .version('0.0.0')

// Locales
program
  .command('locales:download')
  .description('Download the locales from the development branch')
  .action(() => {
    download()
  })

program
  .command('locales:compare')
  .description('Compare your current locales against the development branch')
  .action(() => {
    console.log(compareLanguageVersions())
  })

program
  .command('locales:changelog')
  .description('Generate a new section of changelog for MIGRATION.md')
  .action(() => {
    console.log('Generating markdown...')
    generateChangelog()
    console.log('A new markdown file has been generated: locale-changes.md')
  })

program
  .command('locales:bugs')
  .description('Generate a new section of changelog for MIGRATION.md')
  .action(() => {
    console.log(
      [
        '----------------------------------------',
        'Explanation:',
        '- added: Not available in base language',
        '- deleted: Missing from this language',
        '----------------------------------------',
      ].join('\n')
    )

    console.log(compareAgainstBaseLanguage())

    console.log(
      [
        '----------------------------------------',
        'Empty translations:',
        '----------------------------------------',
      ].join('\n')
    )
    console.log(findEmptyTranslations())
  })

program.parse()
