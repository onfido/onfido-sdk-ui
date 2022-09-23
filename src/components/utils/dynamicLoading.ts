type OnloadCallback = () => void

export const loadExternalScript = (src: string, onload: OnloadCallback) => {
  const script = document.createElement('script')
  script.type = 'application/javascript'
  script.async = true
  script.src = src
  script.onload = onload

  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode?.insertBefore(script, firstScriptTag)
}
