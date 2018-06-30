export const parseTags = (str, handleTag) => {
  const parser = new DOMParser();
  const stringToXml = parser.parseFromString(`<l>${str}</l>`, 'application/xml')
  const xmlToNodesArray = Array.from(stringToXml.firstChild.childNodes)
  return xmlToNodesArray.map(
    node => node.nodeType === document.TEXT_NODE ? node.textContent : handleTag({type: node.tagName, text: node.textContent})
  )
}
