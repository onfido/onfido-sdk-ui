import { kebabCase } from '~utils/string'
import { UICustomizationOptions } from '~types/ui-customisation-options'

export const setUICustomizations = (customUI: UICustomizationOptions): void => {
  const sdkCustomisations = Object.entries(customUI).map(
    ([property, value]) => `--osdk-${kebabCase(property)}: ${value};`
  )
  if (sdkCustomisations.length > 0) {
    const style = document.createElement('style')
    style.textContent = `:root { ${sdkCustomisations.join('\n')} }`
    document.head.appendChild(style)
  }
}

export const isButtonGroupStacked = (): boolean =>
  'true' ===
  getComputedStyle(document.body)
    .getPropertyValue('--osdk-button-group-stacked')
    .trim()
