import {generateCSSStyle, Style} from "./model";
import React from "react";

const CSS_PROP_NAMES = {
    'fontFamily': 'font-family',
    'backgroundColor': 'background-color',
    'color': 'color',
    'fontSize': 'font-size',
    'fontWeight': 'font-weight',
    'textShadow': 'text-shadow',
}

export function CSSExportView(props: { style: Style }) {
    let style = generateCSSStyle(props.style)
    let str = ""
    Object.keys(style).forEach(propName => {
        // @ts-ignore
        if (!CSS_PROP_NAMES[propName]) {
            console.log("MISSING name", propName)
        }
        const value = style[propName]
        // @ts-ignore
        str += `${CSS_PROP_NAMES[propName]}: ${value};
`
    })
    return <textarea className={'css-export-view'} readOnly={true} value={str} rows={10}/>
}
