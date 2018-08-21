export const snakeToUpperFirstCase = (str) =>
  str.substr(0, 1).toUpperCase() + str.substr(1).split('_').join(' ')

export const snakeToKebabCase = str => str.replace(/_/g, '-')

export const randomId = () => Math.random().toString(36).substring(7)
