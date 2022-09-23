// @ts-nocheck
import fs from 'fs'
import { join } from 'path'
import { addedDiff, deletedDiff } from 'deep-object-diff'

export const baseDir = join(__dirname, '../base')
export const srcDir = 'src/locales'

export const getLanguages = (dir: string) => {
  return fs
    .readdirSync(dir)
    .filter((path) => path.match(/[a-z]{2}_[A-Z]{2}/))
    .sort((a, b) => a.localeCompare(b))
}

export const languageMap = {
  de_DE: 'German',
  en_US: 'English',
  es_ES: 'Spanish',
  fr_FR: 'French',
  nl_NL: 'Dutch',
  it_IT: 'Italian',
  pt_PT: 'Portuguese',
}

export const convertLanguageKeysToReadable = (languages) => {
  if (typeof languages === 'string') {
    return languageMap[languages]
  }

  const lastLanguage = languages.pop()

  return [
    ...languages.map((key) => languageMap[key]),
    `and ${languageMap[lastLanguage]}`,
  ].join(', ')
}

export const arrayToObject = (array) => {
  const obj = {}
  array.forEach((i) => (obj[i] = i))
  return obj
}

export function objectToKeyStrings(obj, cb) {
  const list = []
  const convert = (obj, keyString) => {
    // Handle deleted values
    if (obj === undefined) {
      obj = 'undefined'
    }

    if (typeof obj === 'string') {
      cb && cb(keyString, obj)
      list.push(keyString)
      return
    }

    const children = Object.entries(obj)

    if (children) {
      children.forEach(([key, value]) => {
        convert(value, keyString ? `${keyString}.${key}` : key)
      })
      return
    }
  }

  convert(obj, undefined)
  return list
}

// Combine objects of strings
// Format: { [key]: [language_1, language_2]}
export function combine(base, addition, language) {
  const changes = base || {}

  addition.forEach((key) => {
    if (!(key in changes)) {
      changes[key] = []
    }
    changes[key].push(language)
  })

  return changes
}

export const getNewAndRemovedLanguages = () => {
  const languagesBase = getLanguages(baseDir)
  const languagesNew = getLanguages(srcDir)

  const added = Object.values(
    addedDiff(arrayToObject(languagesBase), arrayToObject(languagesNew))
  )

  const removed = Object.values(
    deletedDiff(arrayToObject(languagesBase), arrayToObject(languagesNew))
  )

  return { added, removed, base: languagesBase, new: languagesNew }
}

export const capitalizeString = (string) => {
  return [
    string.slice(0, 1).toUpperCase(),
    ...string.slice(1, string.length),
  ].join('')
}
