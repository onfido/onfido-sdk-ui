import { kebabCase } from '~utils/string'
import { UICustomizationOptions } from '~types/ui-customisation-options'

export const setUICustomisations = (customUI: UICustomizationOptions): void => {
  const sdkCustomisations = Object.entries(customUI).map(
    ([property, value]) => `--osdk-${kebabCase(property)}: ${value};`
  )
  if (sdkCustomisations.length > 0) {
    const style = `
      <style>
          :root {
            ${sdkCustomisations.join('\n')}
          }
      </style>`
    document.head.insertAdjacentHTML('beforeend', style)
  }
}

export const isButtonGroupStacked = (): boolean =>
  'true' ===
  getComputedStyle(document.body)
    .getPropertyValue('--osdk-button-group-stacked')
    .trim()
