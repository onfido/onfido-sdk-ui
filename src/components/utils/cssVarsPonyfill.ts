/**
 * If the browser does NOT support CSS Variables
 * loads and applies css-vars-ponyfill.
 */
export function cssVarsPonyfill() {
  if (window?.CSS?.supports('color', 'var(--foo)')) return

  const script = document.createElement('script')
  script.src = `https://unpkg.com/css-vars-ponyfill@2.3.2`
  // @ts-ignore eslint-disable-next-line no-undef
  script.onload = () => cssVars({ watch: true })
  document.head.appendChild(script)
}
