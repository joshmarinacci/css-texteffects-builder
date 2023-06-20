import {Style} from "./model";
import React from "react";

export function JSObjView(props: { style: Style }) {
    let str = Object.keys(props.style).map(name => {
        // @ts-ignore
        let val = props.style[name];
        let text = '' + val
        if (typeof val === 'string') text = `"${val}"`
        if (typeof val === 'object') {
            if (val.hasOwnProperty('h')) {
                text = `{ h:${val.h}, s:${val.s}, l:${val.l}, a:${val.a} }`
            }
        }
        return `${name}: ${text}`
    }).join(",\n")
    return <textarea className={'css-export-view'} readOnly={false} value={str} rows={10}/>
}
