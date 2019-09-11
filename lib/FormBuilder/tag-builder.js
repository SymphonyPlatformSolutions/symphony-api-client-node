module.exports = (tagName, fields = {}, contents = '', isSelfClosing = false) => {
  const fieldList = Object.keys(fields)
    .map(key => ` ${key}="${fields[key]}"`)
    .join('')
  const closingTag = isSelfClosing ? ' />\n' : `>${contents}</${tagName}>\n`
  return `<${tagName}${fieldList}${closingTag}`
}
