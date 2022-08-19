// @ts-nocheck
import fs from 'fs'
import { detailedDiff } from 'deep-object-diff'
import { getLanguages, baseDir, srcDir, objectToKeyStrings } from './util'

const languagesBase = getLanguages(baseDir)

export const compareLanguageVersions = () => {
  const langDiffs = []

  languagesBase.forEach((language) => {
    const baseFile = `${baseDir}/${language}/${language}.json`
    const newFile = `${srcDir}/${language}/${language}.json`

    const baseData = fs.existsSync(baseFile)
      ? JSON.parse(fs.readFileSync(baseFile, 'utf-8'))
      : {}
    const newData = fs.existsSync(newFile)
      ? JSON.parse(fs.readFileSync(newFile, 'utf-8'))
      : {}

    const { added, deleted, updated } = detailedDiff(baseData, newData) || {}

    const keyDiff = {
      language,
      added: objectToKeyStrings(added),
      deleted: objectToKeyStrings(deleted),
      updated: objectToKeyStrings(updated),
    }

    langDiffs.push(keyDiff)
  })

  return langDiffs
}
