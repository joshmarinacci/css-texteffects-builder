import React, {useEffect, useState} from 'react';
import './App.css';
import {GOOGLE_FONTS, HSLColor, objToHsla, Style, StyleSchema} from "./model";
import {useHistoryDoc} from "./schema";
import {AutoForm} from "./autoform";
import {HBox, PopupContainer, TabbedPanel, VBox} from "josh_react_util";
import {lerp_number} from "josh_js_util";

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
  strokeColor: {h: 52,s:0.01,l:0.81,a:1.0},

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
  },
  shadowGradientEnabled: false,
  shadowGradientSteps: 2,
  shadowEndColor: {
    h: 0.5,
    s: 1.0,
    l: 0.5,
    a: 1.0,
  },
}


function lerpHSL(t: number, start: HSLColor, end: HSLColor) {
    let color:HSLColor = {
      h:lerp_number(t,start.h,end.h),
      s:lerp_number(t,start.s,end.s),
      l:lerp_number(t,start.l,end.l),
      a:lerp_number(t,start.a,end.a),
    }
    return color
}

function generateCSSStyle(s: Style):Record<string,string> {
  const style:any = {
    fontSize:`${s.fontSize}px`,
    fontWeight: s.fontWeight,
    fontFamily: s.fontFamily,
  }
  style.color = objToHsla(s.color)
  style.backgroundColor = objToHsla(s.backgroundColor)
  if(s.strokeEnabled) {
    style['-webkit-text-stroke-width'] = `${s.strokeWidth}px`;
    style['-webkit-text-stroke-color'] = `${objToHsla(s.strokeColor)}`;
  }
  if(s.shadowEnabled) {
    style.textShadow = `${s.shadowOffsetX}px ${s.shadowOffsetY}px ${s.shadowBlurRadius}px ${objToHsla(s.shadowColor)}`;
  }
  if(s.shadowGradientEnabled) {
    let txx:string[] = []
    for(let i=0; i<s.shadowGradientSteps+1; i++) {
      let t= i/s.shadowGradientSteps;
      let color = lerpHSL(t,s.shadowColor,s.shadowEndColor)
      let x_off = lerp_number(t,0,s.shadowOffsetX)
      let y_off = lerp_number(t,0,s.shadowOffsetY)
      let blur = lerp_number(t,0,s.shadowBlurRadius)
      let tf = ` ${x_off}px ${y_off}px ${blur}px ${objToHsla(color)}`
      txx.push(tf)
    }
    style.textShadow = txx.join(',')
  }
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
  strokeColor: {h: 52,s:0.01,l:0.81,a:1.0},
  shadowOffsetX: 5,
  shadowOffsetY: 5,
  shadowBlurRadius: 0,
  backgroundColor: { h: 0, s: 1, l:1, a:1},
  shadowColor: { h: 53, s: 0.95, l:0.7, a:1},
  fontWeight: 'bold',
  strokeWidth: 0,
  shadowGradientEnabled: false,
  shadowGradientSteps:2,
  shadowEndColor: { h: 0, s: 1, l:1, a:1},
})
PRESETS.set('green neon',{
  sample:'neon',
  fontSize: 150,
  fontFamily: 'sans-serif',
  fontWeight: '100',
  color: { h:117, s:0.38,l:0.44,a:1.0},
  backgroundColor: { h:117, s:0.0, l:0.0, a:1.0},
  strokeEnabled: false,
  strokeWidth: 0,
  strokeColor: {h: 52,s:0.01,l:0.81,a:1.0},
  shadowEnabled: true,
  shadowOffsetX: 0,
  shadowOffsetY: 5,
  shadowBlurRadius: 20,
  shadowColor: {h: 52,s:0.39,l:0.97,a:1.0},
  shadowGradientEnabled: false,
  shadowGradientSteps:2,
  shadowEndColor: { h: 0, s: 1, l:1, a:1},
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
  strokeColor: {h: 52,s:0.01,l:0.81,a:1.0},
  shadowEnabled: true,
  shadowOffsetX: -16,
  shadowOffsetY: 0,
  shadowBlurRadius: 20,
  shadowColor: {h: 52,s:0.01,l:0.81,a:1.0},
  shadowGradientEnabled: false,
  shadowGradientSteps:2,
  shadowEndColor: { h: 0, s: 1, l:1, a:1},
})
PRESETS.set('fire text', {
  sample: "Fire",
  fontSize: 216,
  fontFamily: "system-ui",
  fontWeight: "bold",
  color: { h:0.5, s:0, l:1, a:1 },
  backgroundColor: { h:3.9418562068495633, s:0, l:0, a:1 },
  strokeEnabled: false,
  strokeWidth: 3,
  strokeColor: {h: 52,s:0.01,l:0.81,a:1.0},
  shadowEnabled: true,
  shadowOffsetX: 6.5,
  shadowOffsetY: 30,
  shadowBlurRadius: 0,
  shadowColor: { h:63.627894201944045, s:1, l:0.5, a:1 },
  shadowGradientEnabled: true,
  shadowGradientSteps: 5,
  shadowEndColor: { h:0, s:1, l:0.5, a:1 }
})
PRESETS.set('70s fade',{
  sample: "12:57",
  fontSize: 204,
  fontFamily: "sans-serif",
  fontWeight: "bold",
  color: { h:52, s:0, l:0, a:1 },
  backgroundColor: { h:52.00000000000024, s:1, l:0.94965, a:1 },
  strokeEnabled: false,
  strokeWidth: 0.5,
  strokeColor: { h:52.000000000000234, s:0, l:0, a:1 },
  shadowEnabled: true,
  shadowOffsetX: 41,
  shadowOffsetY: 100,
  shadowBlurRadius: 0,
  shadowColor: { h:52.00000000000001, s:1, l:0.97585, a:1 },
  shadowGradientEnabled: true,
  shadowGradientSteps: 100,
  shadowEndColor: { h:14.930228299872814, s:1, l:0.4987, a:1 }
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
  return <textarea className={'css-export-view'} readOnly={true} value={str} rows={10}/>
}

function PNGExportView(props: { style: Style }) {
  const [text, setText] = useState('ABC123')
  return <div>
    <HBox>
      <label>characters</label>
      <input type={'text'}
             value={text}
             onChange={(e) => setText(e.target.value)}/>
    </HBox>
    <StyleView style={props.style}/>
    <button>export</button>
  </div>
}

function JSObjView(props: { style: Style }) {
  let str = Object.keys(props.style).map(name => {
    // @ts-ignore
    let val = props.style[name];
    let text = ''+val
    if(typeof val === 'string') text = `"${val}"`
    if(typeof val === 'object') {
      if(val.hasOwnProperty('h')) {
        text = `{ h:${val.h}, s:${val.s}, l:${val.l}, a:${val.a} }`
      }
    }
    return `${name}: ${text}`
  }).join(",\n")
  return <textarea className={'css-export-view'} readOnly={false} value={str} rows={10}/>
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
    <VBox>
      <h1>Style a Text </h1>
      <HBox>
        <div className={'vbox'}>
          {Array.from(PRESETS.keys()).map(key => {
            return <button className={'preset'} key={key} onClick={()=>setStyle(PRESETS.get(key) as Style)}>{key}</button>
          })}
        </div>
        <AutoForm object={style} schema={StyleSchema} onChange={setStyle}/>
        <StyleView style={style}/>
      </HBox>
      <h3>Export</h3>
      {/*<div className={'text'}>hello</div>*/}
      <TabbedPanel titles={['css','png','js']}>
        <CSSExportView style={style}/>
        <PNGExportView style={style}/>
        <JSObjView style={style}/>
      </TabbedPanel>
    </VBox>
    <PopupContainer/>
  </div>
}

export default App;
