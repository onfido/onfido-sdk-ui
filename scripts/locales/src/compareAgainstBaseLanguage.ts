// @ts-nocheck
import fs from 'fs'
import { addedDiff, deletedDiff } from 'deep-object-diff'
import { getLanguages, srcDir, objectToKeyStrings } from './util'

const languagesNew = getLanguages(srcDir)

/*
  Compare the a language against a base language and see which keys are different

  Output:
    - baseLanguage: The language we take as source of truth
    - secondaryLanguage: A secondary language we compare to our source of truth
    - added: Keys are the NOT available in the base language, but are in the secondary language. Probably should be removed from secondary language
    - delted: Missing keys in secondary, should be added
*/
const baseLanguage = 'en_US'
export const compareAgainstBaseLanguage = () => {
  const langDiffs = []

  languagesNew.forEach((secondaryLanguage) => {
    const baseFile = JSON.parse(
      fs.readFileSync(`${srcDir}/${baseLanguage}/${baseLanguage}.json`, 'utf-8')
    )
    const compareFile = JSON.parse(
      fs.readFileSync(
        `${srcDir}/${secondaryLanguage}/${secondaryLanguage}.json`,
        'utf-8'
      )
    )

    const added = addedDiff(baseFile, compareFile) || {}
    const deleted = deletedDiff(baseFile, compareFile) || {}

    const keyDiff = {
      baseLanguage,
      secondaryLanguage,
      added: objectToKeyStrings(added),
      deleted: objectToKeyStrings(deleted),
    }

    langDiffs.push(keyDiff)
  })

  return langDiffs
}
