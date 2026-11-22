import { generateCSSStyle, Style } from './model'

const CSS_PROP_NAMES: Record<string, string> = {
  fontFamily: 'font-family',
  backgroundColor: 'background-color',
  color: 'color',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  textShadow: 'text-shadow',
}

export function CSSExportView(props: { style: Style }) {
  const style = generateCSSStyle(props.style)
  let str = ''
  Object.entries(style).forEach(([propName, value]) => {
    if (!CSS_PROP_NAMES[propName]) {
      console.log('MISSING name', propName)
    }
    str += `${CSS_PROP_NAMES[propName]}: ${value};
`
  })
  return (
    <textarea className={'export-text'} aria-label="CSS" readOnly={true} value={str} rows={10} />
  )
}
