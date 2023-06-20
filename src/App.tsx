import React from 'react';
import './App.css';
import {default_style, Style, StyleSchema} from "./model";
import {useHistoryDoc} from "./schema";
import {AutoForm} from "./autoform";
import {HBox, PopupContainer, TabbedPanel, VBox} from "josh_react_util";
import {PNGExportView} from "./pngexport";
import {CSSExportView} from "./cssexport";
import {JSObjView} from "./jsexport";
import {PresetsList} from "./presets";
import {StyleView} from "./styleview";
import {useGoogleFonts} from "./utils";

function App() {
  const [style, setStyle] = useHistoryDoc<Style>(StyleSchema, default_style)
  useGoogleFonts()
  return <div className={'main'}>
    <VBox>
      <h1>Style a Text </h1>
      <HBox>
        <PresetsList setStyle={setStyle}/>
        <AutoForm object={style} schema={StyleSchema} onChange={setStyle}/>
        <StyleView style={style}/>
      </HBox>
      <h3>Export</h3>
      <TabbedPanel titles={['css', 'png', 'js']}>
        <CSSExportView style={style}/>
        <PNGExportView style={style}/>
        <JSObjView style={style}/>
      </TabbedPanel>
    </VBox>
    <PopupContainer/>
  </div>
}

export default App;
