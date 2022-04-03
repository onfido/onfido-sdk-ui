import * as fs from 'fs'
import { logErrorAndExit } from './output'

const basePath = process.cwd()

export const readFromFile = async (file: string) => {
  let data
  try {
    data = await fs.readFileSync(file, 'utf-8')
  } catch (e) {
    logErrorAndExit(
      `Something went wrong trying to load the file! (${file})`,
      e
    )
    return
  }

  return data
}

export const writeToFile = async (file: string, content: string) => {
  try {
    fs.writeFileSync(`${basePath}/${file}`, content, 'utf-8')
  } catch (e) {
    logErrorAndExit(
      `Something went wrong trying to write to the file! (${file})`,
      e
    )
  }
}

export const replaceInFile = async (
  file: string,
  regex: string | RegExp,
  replaceFunc: string
) => {
  const filePath = `${basePath}/${file}`
  const data = await readFromFile(filePath)

  if (!data) {
    return
  }

  const result = data.replace(regex, replaceFunc)
  await writeToFile(filePath, result)
}

export const getFromFile = async (file: string, regex: string | RegExp) => {
  const data = await readFromFile(`${basePath}/${file}`)
  if (!data) {
    return
  }
  return data.match(regex)
}

export const appendToFile = async (
  file: string,
  content: string
): Promise<void> => {
  try {
    fs.appendFileSync(`${basePath}/${file}`, content, 'utf-8')
  } catch (e) {
    logErrorAndExit(
      `Something went wrong trying to append to the file! (${file})`,
      e
    )
    return
  }
}
