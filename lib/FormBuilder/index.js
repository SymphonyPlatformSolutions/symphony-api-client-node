const Tag = require('./tag-builder')

module.exports = (formId) => {
  const formatElement = () => Tag('form', { id: formId }, tagBuilder.messageML)

  const addLineBreak = () => {
    tagBuilder.messageML += Tag('br', {}, '', true)
    return tagBuilder
  }

  const addLineBreaks = (quantity) => {
    for (let i=0; i<quantity; i++) {
      tagBuilder.addLineBreak()
    }
    return tagBuilder
  }

  const addDiv = (contents) => {
    tagBuilder.messageML += Tag('div', {}, contents)
    return tagBuilder
  }

  const addHeader = (size, text) => {
    if (size < 1 || size > 6) {
      size = 6;
    }
    tagBuilder.messageML += Tag(`h${size}`, {}, text)
    return tagBuilder
  }

  const addButton = (name, display, type = 'action') => {
    tagBuilder.messageML += Tag('button', { name, type: type.toLowerCase() }, display)
    return tagBuilder
  }

  const addTextField = (name, display, placeholder, required = false, masked = false, minlength = 0, maxLength = 200) => {
    tagBuilder.messageML += Tag(
      'text-field',
      { name, placeholder, required, masked, minlength, maxLength },
      display
    )
    return tagBuilder
  }

  const addTextArea = (name, display, placeholder, required = false) => {
    tagBuilder.messageML += Tag(
      'textarea',
      { name, placeholder, required },
      display
    )
    return tagBuilder
  }

  const addCheckBox = (name, display, value, checked = false) => {
    tagBuilder.messageML += Tag(
      'checkbox',
      { name, value, checked },
      display
    )
    return tagBuilder
  }

  const addRadioButton = (name, display, value, checked = false) => {
    tagBuilder.messageML += Tag(
      'radio',
      { name, value, checked },
      display
    )
    return tagBuilder
  }

  const addDropdownMenu = (name, required, options) => {
    const optionsML = options
      .map(option => Tag(
        'option',
        { value: option.value, selected: option.selected },
        options.display
      ))
      .join('')

    tagBuilder.messageML += Tag(
      'select',
      { name, required },
      optionsML
    )
    return tagBuilder
  }

  const addPersonSelector = (name, placeholder, required = false) => {
    tagBuilder.messageML += Tag(
      'person-selector',
      { name, placeholder, required },
      '',
      true
    )
    return tagBuilder
  }

  const addTableSelect = (name, selectorDisplay, position = 'left', type = 'checkbox', header, body, footer) => {
    let headerML = '';
    let bodyML = '';
    let footerML = '';

    if (!name) {
      name = "table-select"
    } else {
      name = name.replace(/[^a-zA-Z0-9]/g, '')
      if (name.trim().length === 0) {
        name = "table-select"
      }
    }

    if (!selectorDisplay || selectorDisplay.trim().length === 0) {
      selectorDisplay = 'Select'
    }

    if (header && header.length > 0) {
      const workingHeader = [ header ]
      let headerSelector = "Select"
      if (type.toLowerCase() === 'checkbox') {
        headerSelector = Tag(
          'input',
          { type: 'checkbox', name: `${name}-header`},
          '',
          true
        )
      }
      if (position.toLowerCase() === 'left') {
        workingHeader.unshift(headerSelector)
      } else {
        workingHeader.push(headerSelector)
      }

      const headerRow = workingHeader.map(value => Tag('td', {}, value)).join('')

      headerML = Tag('thead', {}, Tag('tr', {}, headerRow))
    }

    if (body && body.length > 0) {
      const workingBody = []
      for (let i = 0; i < body.length; i++) {
        let bodyRow = [ body[i] ];
        const rowSelector = buildRowSelector(name + "-row-" + i, type, selectorDisplay);

        if (position.toLowerCase() === 'left') {
          bodyRow.unshift(rowSelector)
        } else {
          bodyRow.push(rowSelector)
        }
        workingBody.push(bodyRow);
      }

      const bodyRows = workingBody.map(
          bodyRow => Tag(
            'tr',
            {},
            bodyRow.map(value => Tag('td', {}, value))
          )
        )
        .join('')

      bodyML = `<tbody>${bodyRows}</tbody>`
    }

    if (footer && footer.length > 0) {
      const workingFooter = [ footer ];
      const footerSelector = buildRowSelector(name + "-footer", type, selectorDisplay);

      if (position.toLowerCase() === 'left') {
        workingFooter.unshift(footerSelector)
      } else {
        workingFooter.push(footerSelector)
      }

      const footerRow = workingFooter.map(value => Tag('td', {}, value)).join('')

      footerML = Tag('tfoot', {}, Tag('tr', {}, footerRow))
    }

    const tableML = Tag('table', {}, `${headerML}${bodyML}${footerML}`)
    tagBuilder.messageML += tableML

    return tagBuilder
  }

  const buildRowSelector = (selectorName, type = "checkbox", selectorDisplay) => {
    if (type.toLowerCase() === "button") {
      return Tag('button', { name: selectorName }, selectorDisplay)
    }
    return Tag(
      'input',
      { name: selectorName, type: 'checkbox' },
      '',
      true
    )
  }

  const tagBuilder = {
    messageML: '',
    formatElement,
    addLineBreak,
    addLineBreaks,
    addDiv,
    addHeader,
    addButton,
    addTextField,
    addTextArea,
    addCheckBox,
    addRadioButton,
    addDropdownMenu,
    addPersonSelector,
    addTableSelect
  }

  return tagBuilder
}
