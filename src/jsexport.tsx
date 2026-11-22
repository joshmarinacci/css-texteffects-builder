import { Style } from './model'

export function JSObjView(props: { style: Style }) {
  const str = Object.entries(props.style)
    .map(([name, val]) => {
      let text = '' + val
      if (typeof val === 'string') text = `"${val}"`
      if (typeof val === 'object' && val !== null && 'h' in val) {
        text = `{ h:${val.h}, s:${val.s}, l:${val.l}, a:${val.a} }`
      }
      return `${name}: ${text}`
    })
    .join(',\n')
  return (
    <textarea
      className={'export-text'}
      aria-label="JavaScript object"
      readOnly={true}
      value={str}
      rows={10}
    />
  )
}
