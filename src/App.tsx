import React, {useEffect} from 'react';
import './App.css';
import {GOOGLE_FONTS, HSLColor, objToHsla, Style, StyleSchema} from "./model";
import {useHistoryDoc} from "./schema";
import {AutoForm} from "./autoform";
import {PopupContainer} from "josh_react_util";

const default_style:Style = {
  fontSize: 20,
  sample: 'abc123',
  fontFamily: 'system-ui',
  fontWeight: 'bold',
  color: {
    h:30,
    s: 1,
    l: 0.5,
    a: 1.0,
  },

  strokeEnabled: false,
  strokeWidth: 3,
  shadowOffsetX: 3,
  shadowOffsetY: 3,
  shadowBlurRadius: 3,
  shadowEnabled: true,
  shadowColor: {
    h: 0,
    s: 0,
    l: 0,
    a: 1.0,
  },
  backgroundColor: {
    h: 0.5,
    s: 1.0,
    l: 0.5,
    a: 1.0,
  }
}


function generateCSSStyle(s: Style):Record<string,string> {
  const style:any = {
    fontSize:`${s.fontSize}px`,
    fontWeight: s.fontWeight,
    fontFamily: s.fontFamily,
  }
  if(s.strokeEnabled) {
    style['-webkit-text-stroke-width'] = `${s.strokeWidth}px`;
  }
  if(s.shadowEnabled) {
    style.textShadow = `${s.shadowOffsetX}px ${s.shadowOffsetY}px ${s.shadowBlurRadius}px ${objToHsla(s.shadowColor)}`;
  }
  style.color = objToHsla(s.color)
  style.backgroundColor = objToHsla(s.backgroundColor)
  return style
}

function StyleView(props: { style: Style }) {
  const style = generateCSSStyle(props.style)
  return <div className={'style-output-wrapper'}>
    <span style={style}>{props.style.sample}</span>
  </div>
}

const PRESETS = new Map<string,Style>()
PRESETS.set('hotdog',{
  sample:'hotdog',
  fontSize: 150,
  fontFamily: 'sans-serif',
  color: {
    h: 16,
    s: 1.0,
    l: 0.5,
    a: 1.0,
  },
  strokeEnabled: false,
  shadowEnabled: true,
  shadowOffsetX: 5,
  shadowOffsetY: 5,
  shadowBlurRadius: 0,
  backgroundColor: { h: 0, s: 1, l:1, a:1},
  shadowColor: { h: 53, s: 0.95, l:0.7, a:1},
  fontWeight: 'bold',
  strokeWidth: 0,
})
PRESETS.set('neon-green',{
  sample:'neon green',
  fontSize: 150,
  fontFamily: 'sans-serif',
  fontWeight: '100',
  color: { h:117, s:0.38,l:0.44,a:1.0},
  backgroundColor: { h:117, s:0.0, l:0.0, a:1.0},
  strokeEnabled: false,
  strokeWidth: 0,
  shadowEnabled: true,
  shadowOffsetX: 0,
  shadowOffsetY: 5,
  shadowBlurRadius: 20,
  shadowColor: {h: 52,s:0.39,l:0.97,a:1.0},
})
const WHITE:HSLColor = {
  h:0, s:0, l:1, a:1
}
PRESETS.set('only shadows', {
  sample:'SHADOWS',
  fontSize: 127,
  fontFamily: 'sans-serif',
  fontWeight: 'bold',
  color: WHITE,
  backgroundColor: WHITE,
  strokeEnabled: false,
  strokeWidth: 0,
  shadowEnabled: true,
  shadowOffsetX: -16,
  shadowOffsetY: 0,
  shadowBlurRadius: 20,
  shadowColor: {h: 52,s:0.01,l:0.81,a:1.0},
})

const CSS_PROP_NAMES = {
  'fontFamily':'font-family',
  'backgroundColor':'background-color',
  'color':'color',
  'fontSize':'font-size',
  'fontWeight':'font-weight',
  'textShadow':'text-shadow',
}
function CSSExportView(props: { style: Style }) {
  let style = generateCSSStyle(props.style)
  let str = ""
  Object.keys(style).forEach(propName => {
    // @ts-ignore
    if(!CSS_PROP_NAMES[propName]) {
      console.log("MISSING name",propName)
    }
    const value = style[propName]
    // @ts-ignore
    str += `${CSS_PROP_NAMES[propName]}: ${value};
`
  })
  return <textarea readOnly={true} value={str} rows={10}/>
}

function App() {
  const [style, setStyle] = useHistoryDoc<Style>(StyleSchema, default_style)
  useEffect(() => {
    const links = document.querySelectorAll('link')
    const linkmap = new Map<string,HTMLLinkElement>()
    links.forEach(link => {
      if(link.hasAttribute('href')) {
        linkmap.set(link.getAttribute('href') as string, link)
      }
    })
    GOOGLE_FONTS.forEach(fnt => {
      const url = fnt.url
      if(!linkmap.has(url)) {
        const link = document.createElement('link')
        link.setAttribute('rel','stylesheet')
        link.setAttribute('href',url)
        document.head.appendChild(link)
        console.log("loading link",url)
      }
    })
  },[])
  return <div className={'main'}>
    <div className={'vbox'}>
      <div className={'hbox'}>
    {/*<h1>Style a Text </h1>*/}
    <div className={'vbox'}>
      {Array.from(PRESETS.keys()).map(key => {
        return <button className={'preset'} key={key} onClick={()=>setStyle(PRESETS.get(key) as Style)}>{key}</button>
      })}
    </div>
    <AutoForm object={style} schema={StyleSchema} onChange={setStyle}/>
    <StyleView style={style}/>
      </div>
    <CSSExportView style={style}/>
    </div>
    {/*<div className={'text'}>hello</div>*/}
      <PopupContainer/>
  </div>
}

export default App;
