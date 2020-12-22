export const isButtonGroupVertical = () =>
  !!JSON.parse(
    getComputedStyle(document.body).getPropertyValue('--button-group-vertical')
  )
