import {Style} from "./model";
import React, {useState} from "react";
import {HBox} from "josh_react_util";

export function PNGExportView(props: { style: Style }) {
    const [text, setText] = useState('ABC123')
    return <div>
        <HBox>
            <label>characters</label>
            <input type={'text'}
                   value={text}
                   onChange={(e) => setText(e.target.value)}/>
        </HBox>
        <button>export</button>
    </div>
}
