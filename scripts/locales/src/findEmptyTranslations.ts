// @ts-nocheck
import fs from 'fs'
import { getLanguages, objectToKeyStrings, srcDir } from './util'

const languagesNew = getLanguages(srcDir)

export const findEmptyTranslations = () => {
  const langDiffs = []

  languagesNew.forEach((language) => {
    const file = JSON.parse(
      fs.readFileSync(`${srcDir}/${language}/${language}.json`, 'utf-8')
    )

    const emptyKeys = []
    objectToKeyStrings(file, (key, value) => {
      if (value.length === 0) {
        emptyKeys.push(key)
      }
    })

    langDiffs.push({ language, emptyKeys })
  })

  return langDiffs
}
