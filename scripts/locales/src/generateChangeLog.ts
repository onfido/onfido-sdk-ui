// @ts-nocheck
import fs from 'fs'
import {
  combine,
  convertLanguageKeysToReadable,
  getNewAndRemovedLanguages,
  capitalizeString,
} from './util'
import { compareLanguageVersions } from './compareLanguageVersions'

const langDiffs = compareLanguageVersions()

// TODO: handle deleted & new languages
export const generateChangelog = () => {
  const languages = getNewAndRemovedLanguages()

  const diffByKey = {
    added: {},
    deleted: {},
    updated: {},
  }

  // Combine the difss in object: [key] = [language_1, language_2]
  langDiffs.forEach(({ language, ...diffs }) => {
    diffByKey.added = combine(diffByKey.added, diffs.added, language)
    diffByKey.updated = combine(diffByKey.updated, diffs.updated, language)
    diffByKey.deleted = combine(diffByKey.deleted, diffs.deleted, language)
  })

  /*
    Format:
    - Most keys (all - 2) -> normal format
    - By language
  */

  const organisedChangelog = {
    all: {
      added: {},
      deleted: {},
      updated: {},
    },
    language: {},
  }

  // Added
  const organise = (obj, type) => {
    Object.entries(obj)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([key, languages]) => {
        if (languages.length === langDiffs.length) {
          organisedChangelog.all[type][key] = languages
          return
        }

        languages.forEach((language) => {
          if (!organisedChangelog.language[language]) {
            organisedChangelog.language[language] = {}
          }
          if (!organisedChangelog.language[language][type]) {
            organisedChangelog.language[language][type] = []
          }
          organisedChangelog.language[language][type].push(key)
        })
      })
  }

  organise(diffByKey.added, 'added')
  organise(diffByKey.updated, 'updated')
  organise(diffByKey.deleted, 'deleted')

  // Write the markdown file
  const markdown = []

  const writeMarkdown = (language, changes, all = false) => {
    let entry = [
      `The **${convertLanguageKeysToReadable(
        language
      )}** copy for the following string(s) has been changed:`,
      '', // new line
    ]

    // By language
    if (all) {
      Object.entries(changes).forEach(([type, diff]) => {
        entry = entry.concat([
          `## ${capitalizeString(type)}:`,
          '',
          ...Object.keys(diff).map((key) => ` - \`${key}\``),
          '',
        ])
      })
    } else {
      Object.entries(changes).forEach(([type, diff]) => {
        entry = entry.concat([
          `## ${capitalizeString(type)}:`,
          '',
          ...diff.map((key) => ` - \`${key}\``),
          '',
        ])
      })
    }
    markdown.push(entry.join('\n'))
  }

  // Mention newly added / removed languages
  languages.added?.length &&
    markdown.push(
      `We have added new language(s): **${convertLanguageKeysToReadable(
        languages.added
      )}** `
    )
  languages.deleted?.length &&
    markdown.push(
      `We have deleted new language(s): **${convertLanguageKeysToReadable(
        languages.deleted
      )}** `
    )

  // Changes for all languages
  writeMarkdown(languages.base, organisedChangelog.all, true)

  // Rest of the changes by language
  Object.entries(organisedChangelog.language).forEach(([language, changes]) =>
    writeMarkdown(language, changes)
  )

  fs.writeFileSync('./locale-changes.md', markdown.join('\n\n'))
}
