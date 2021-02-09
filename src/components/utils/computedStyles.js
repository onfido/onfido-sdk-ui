export const isButtonGroupVertical = () =>
  !!JSON.parse(
    getComputedStyle(document.body).getPropertyValue(
      '--osdk-button-group-vertical'
    )
  )
