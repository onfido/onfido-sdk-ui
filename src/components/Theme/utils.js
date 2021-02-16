import { kebabCase } from '~utils/string'

export const setUICustomisations = (customUI = {}): void => {
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

export const isButtonGroupStacked = (): void =>
  !!JSON.parse(
    getComputedStyle(document.body).getPropertyValue(
      '--osdk-button-group-stacked'
    )
  )
