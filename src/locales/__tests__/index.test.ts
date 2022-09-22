import { readFile } from 'fs/promises'
import { readdirSync } from 'fs'

const ALL_LOCALES = [
  'de_DE',
  'en_US',
  'es_ES',
  'fr_FR',
  'it_IT',
  'nl_NL',
  'pt_PT',
]

const LOCALES_WITH_AUTH = ['en_US', 'es_ES', 'fr_FR', 'de_DE']
const NUMBER_OF_AUTH_KEYS_SO_FAR = 57

describe('locales', () => {
  // this test will fail if new locales are added, the idea is to force the developer to add the new locale to the above list.
  it('All locales should be in the ALL_LOCALES variable', async () => {
    const localeFiles = readdirSync(__dirname + '/../').filter(
      (v) => v.indexOf('_') > -1
    )

    for (let i = 0; i < localeFiles.length; i++) {
      expect(ALL_LOCALES.indexOf(localeFiles[i]) > -1)
    }
  })

  ALL_LOCALES.map((locale) => {
    it(`the file for ${locale} should exist`, async () => {
      await readJsonFile(`../${locale}/${locale}.json`) // throws if the file does not exist
    })

    it(`the file 'no_filename' for ${locale} should NOT be created`, async () => {
      let error: any
      try {
        await readJsonFile(`../${locale}/no_filename.json`) // throws if the file does not exist
      } catch (err) {
        error = err
      }
      expect(error).toBeDefined()
      expect(error.code).toBe('ENOENT')
    })

    it(`each key in the 'en_US' file must also be in the '${locale}' file, in the same order`, async () => {
      const en_US = await readJsonFile('../en_US/en_US.json') // throws if the file does not exist
      const localeJson = await readJsonFile(`../${locale}/${locale}.json`) // throws if the file does not exist

      const keys_US = removeAuthKeys(flattenKeys(en_US))
      const keys_locale = removeAuthKeys(flattenKeys(localeJson))

      expect(keys_locale.length).toBe(keys_US.length)

      for (let i = 0; i < keys_locale.length; i++) {
        expect(keys_locale[i]).toBe(keys_US[i])
      }
    })

    // this respects the order of keys when we download from lokalise. This test prevents people from manually adding keys wherever
    it(`each key in the '${locale}' file must be declared in alphabetical order`, async () => {
      const localeJson = await readJsonFile(`../${locale}/${locale}.json`) // throws if the file does not exist
      const keys_locale = removeAuthKeys(flattenKeys(localeJson))

      for (let i = 0; i < keys_locale.length - 1; i++) {
        const splitted = keys_locale[i].split('.')
        const splitted2 = keys_locale[i + 1].split('.')

        const minLength = Math.min(splitted.length, splitted2.length)

        for (let j = 0; j < minLength; j++) {
          // we compare each level of the key, either the level is -1, meaning [j] is before [j-1] and we stop, or it's zero and we must compare next level
          if (splitted[j].localeCompare(splitted2[j]) === -1) {
            break
          }
          if (splitted[j].localeCompare(splitted2[j]) === 0) {
            // continue
          }
          if (splitted[j].localeCompare(splitted2[j]) === 1) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(false).toBe(
              `the key '${keys_locale[i]}' should be after the key '${
                keys_locale[i + 1]
              }', but it was declared before it`
            )
          }
        }
        // if we reach the end, the test is succesful
      }
    })
  })

  LOCALES_WITH_AUTH.map((locale) => {
    it(`the '${locale}' file must have the same 'auth*' keys as the en_US file`, async () => {
      const en_US = await readJsonFile('../en_US/en_US.json') // throws if the file does not exist
      const localeJson = await readJsonFile(`../${locale}/${locale}.json`) // throws if the file does not exist

      const keys_US = flattenKeys(en_US).filter((v) => v.startsWith('auth'))
      const keys_locale = flattenKeys(localeJson).filter((v) =>
        v.startsWith('auth')
      )

      expect(keys_US.length >= NUMBER_OF_AUTH_KEYS_SO_FAR).toBe(true)
      expect(keys_locale.length).toBe(keys_US.length)

      for (let i = 0; i < keys_locale.length; i++) {
        expect(keys_locale[i]).toBe(keys_US[i])
      }
    })
  })
})

const readJsonFile = async (path: string) => {
  const file = await readFile(`${__dirname}/${path}`, 'utf8')
  return JSON.parse(file)
}

// auth_* keys should be kept in the locale files even though they are not in lokalise.
// this function removes them from the list.
const removeAuthKeys = (flattenedKeys: string[]) => {
  return flattenedKeys.filter((v) => !v.startsWith('auth'))
}

// recursively traverse locale objects to extract `avc_confirmation.button_primary_upload` keys.
// note the order is respected as this way we can compare ordering too.
const flattenKeys = (localeJson: any): Array<string> => {
  const accumulator: Array<string> = []
  flattenKeysRec(undefined, localeJson, accumulator)
  return accumulator
}

const flattenKeysRec = (
  suffix: string | undefined,
  obj: any,
  acc: Array<string>
) => {
  const keys = Object.keys(obj)
  if (!suffix) {
    suffix = ''
  } else {
    suffix = suffix + '.'
  }

  for (const key of keys) {
    if (typeof obj[key] === 'string') {
      acc.push(suffix + key)
    }
    if (typeof obj[key] === 'object') {
      flattenKeysRec(suffix + key, obj[key], acc)
    }
  }
}
