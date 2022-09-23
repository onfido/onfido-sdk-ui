import { spawn } from 'child_process'

export const download = () => {
  const child = spawn('sh', ['scripts/locales/download.sh'])

  child.stdout.on('data', (data) => {
    console.log(data)
  })

  child.stderr.on('data', (data) => {
    console.error(data)
  })
}
