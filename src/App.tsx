import React from 'react';
import './App.css';
import {objToHsla, Style, StyleSchema} from "./model";
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

function StyleView(props: { style: Style }) {
  const s = props.style
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
  return <div className={'style-output-wrapper'}>
    <span style={style}>{props.style.sample}</span>
  </div>
}

function App() {
  const [style, setStyle] = useHistoryDoc<Style>(StyleSchema, default_style)
  return <div className={'main'}>
    {/*<h1>Style a Text </h1>*/}
    <AutoForm object={style} schema={StyleSchema} onChange={setStyle}/>
    <StyleView style={style}/>
    {/*<div className={'text'}>hello</div>*/}
      <PopupContainer/>
  </div>
}

export default App;
