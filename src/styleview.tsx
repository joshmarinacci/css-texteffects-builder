import {generateCSSStyle, Style} from "./model";
import React from "react";

export function StyleView(props: { style: Style }) {
    const style = generateCSSStyle(props.style)
    return <div className={'style-output-wrapper'}>
        <span style={style}>{props.style.sample}</span>
    </div>
}
