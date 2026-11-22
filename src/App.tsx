import './App.css'
import {
  countShadowLayers,
  default_style,
  GOOGLE_FONTS,
  Overrides,
  Style,
  StyleSchema,
} from './model'
import { useHistoryDoc } from './schema'
import { AutoForm } from './autoform'
import { PNGExportView } from './pngexport'
import { CSSExportView } from './cssexport'
import { JSObjView } from './jsexport'
import { PresetsList } from './presets'
import { StyleView } from './styleview'
import { useGoogleFonts } from './utils'

const overrides: Overrides = {
  fontFamily: {
    view: 'dropdown',
    values: GOOGLE_FONTS.map((fnt) => fnt.name),
  },
}

// Inspector panels: schema key -> row label, in display order.
const SECTIONS: { title: string; fields: Record<string, string> }[] = [
  {
    title: 'Text',
    fields: {
      sample: 'Text',
      fontFamily: 'Font',
      fontSize: 'Size',
      fontWeight: 'Weight',
      color: 'Color',
      backgroundColor: 'Background',
    },
  },
  {
    title: 'Stroke',
    fields: { strokeEnabled: 'Enabled', strokeWidth: 'Width', strokeColor: 'Color' },
  },
  {
    title: 'Shadow',
    fields: {
      shadowEnabled: 'Enabled',
      shadowOffsetX: 'Offset X',
      shadowOffsetY: 'Offset Y',
      shadowBlurRadius: 'Blur',
      shadowColor: 'Color',
      shadowGradientEnabled: 'Gradient',
      shadowGradientSteps: 'Steps',
      shadowEndColor: 'End color',
    },
  },
]

function App() {
  const [style, setStyle] = useHistoryDoc<Style>(StyleSchema, default_style)
  useGoogleFonts()
  return (
    <>
      <header>
        <h1>CSS Text Effects Builder</h1>
        <small>
          by <a href="https://josh.earth">Josh.earth</a>
        </small>
      </header>
      <main>
        <section className="preview" aria-label="Preview">
          <StyleView style={style} />
        </section>
        <section>
          <h2>Export</h2>
          <details open>
            <summary>CSS</summary>
            <CSSExportView style={style} />
          </details>
          <details>
            <summary>PNG</summary>
            <PNGExportView style={style} />
          </details>
          <details>
            <summary>JS</summary>
            <JSObjView style={style} />
          </details>
        </section>
      </main>
      <aside aria-label="Inspector">
        <details open>
          <summary>Presets</summary>
          <PresetsList setStyle={setStyle} />
        </details>
        {SECTIONS.map((section) => (
          <details open key={section.title}>
            <summary>{section.title}</summary>
            <AutoForm
              schema={StyleSchema}
              object={style}
              onChange={setStyle}
              overrides={overrides}
              fields={section.fields}
            />
          </details>
        ))}
      </aside>
      <footer>
        <span>
          {style.fontFamily} · {style.fontSize}px · {style.fontWeight}
        </span>
        <span>
          <output>{countShadowLayers(style)}</output> shadow layers
        </span>
      </footer>
    </>
  )
}

export default App
