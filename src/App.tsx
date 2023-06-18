import React from 'react';
import './App.css';
import {Style, StyleSchema} from "./model";
import {useHistoryDoc} from "./schema";
import {AutoForm} from "./autoform";

const default_style:Style = {
  fontSize: 20,
  sample: 'abc123',
  fontFamily: 'system-ui',
  fontWeight: 'bold',
  strokeEnabled: false,
  strokeWidth: 3
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
  return <div className={'style-output-wrapper'}>
    <span style={style}>{props.style.sample}</span>
  </div>
}

function App() {
  const [style, setStyle] = useHistoryDoc<Style>(StyleSchema, default_style)
  console.log("style is",style)
  return <div>
    <h1>Style a Text </h1>
    <AutoForm object={style} schema={StyleSchema} onChange={setStyle}/>
    <StyleView style={style}/>
  </div>
}

export default App;
