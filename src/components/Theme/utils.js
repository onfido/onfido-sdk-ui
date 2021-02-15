import { kebabCase } from '~utils/string'

export const setUICustomisations = (customUI = {}) => {
  const sdkCustomisations = Object.keys(customUI).map(
    (key) => `--osdk-${kebabCase(key)}: ${customUI[key]};`
  )
  const style = `
    <style>
        :root {
          ${sdkCustomisations.join('\n')}
        }
    </style>`
  document.head.insertAdjacentHTML('beforeend', style)
}

export const isButtonGroupVertical = () =>
  !!JSON.parse(
    getComputedStyle(document.body).getPropertyValue(
      '--osdk-button-group-vertical'
    )
  )
