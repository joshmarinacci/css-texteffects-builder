import React from 'react';
import {} from 'josh_js_util'
import {} from 'josh_react_util'
import {} from "josh_web_util"
import z from "zod";
import './App.css';
import {Style, StyleSchema} from "./model";
import {useHistoryDoc} from "./schema";
import {AutoForm} from "./autoform";

const default_style:Style = {
  fontSize: 20,
  sample: 'abc123'
}

function StyleView(props: { style: Style }) {
  return <div className={'style-output-wrapper'}>
  <span style={{
    fontSize:`${props.style.fontSize}px`
  }}>
    {props.style.sample}
  </span>
  </div>
}

function App() {
  const [style, setStyle] = useHistoryDoc<Style>(StyleSchema, default_style)

  return <div>
    <h1>Style a Text </h1>
    <AutoForm object={style} schema={StyleSchema} onChange={setStyle}/>
    <StyleView style={style}/>
    {/*<Renderer solids={solids}  width={800} height={450}/>*/}
    {/*<button onClick={()=>export_stl(solids)}>to STL</button>*/}
  </div>
}

export default App;
