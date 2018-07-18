export const includesRegex = (string, regex) => !!string.match(regex)

export const isOnfidoURL = (url) => includesRegex(url,/^https:\/\/[A-Za-z0-9\.]*\.?onfido\.com/g)
