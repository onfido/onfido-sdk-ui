export const includesRegex = (string, regex) => !!string.match(regex)

/*
Tested pass against:
https://api.onfido.com/v2/documents
https://onfido.com/v2/documents
https://cross.onfido.com/v2/documents
https://cross.lol.onfido.com/v2/documents

Tested fail against:
https://revolut.com/v2/documents/?url=https://onfido.com", /https:\/\/[A-Za-z0-9\.]*\.?onfido\.com/g
https://onfido.revolut.com/v2/documents
https://onfido.revolut.com/v2/documents/onfido.com
 */
export const isOnfidoURL = (url) => includesRegex(url,/^https:\/\/[A-Za-z0-9\.]*\.?onfido\.com/g)
