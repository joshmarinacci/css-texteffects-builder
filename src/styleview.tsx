import { generateCSSStyle, Style } from './model'

export function StyleView(props: { style: Style }) {
  const style = generateCSSStyle(props.style)
  return (
    <div className="style-output-wrapper" style={{ backgroundColor: style.backgroundColor }}>
      <span style={style}>{props.style.sample}</span>
    </div>
  )
}
