import {lerpHSL, objToHsla, Style} from "./model";
import React, {useEffect, useRef, useState} from "react";
import {HBox, VBox} from "josh_react_util";
import {Bounds, lerp_number} from "josh_js_util";

function drawStyleToContext(style: Style, text: string, ctx: CanvasRenderingContext2D, bounds: Bounds) {
    ctx.save()
    ctx.fillStyle = objToHsla(style.backgroundColor)
    ctx.fillRect(bounds.x,bounds.y,bounds.w,bounds.h)

    let c = bounds.center()
    let font = `${style.fontWeight} ${style.fontSize}px "${style.fontFamily}"`
    console.log('canvas font:',font)
    ctx.font = font
    ctx.textAlign = 'center'

    if(style.shadowEnabled) {
        if (style.shadowGradientEnabled) {
            for (let i = style.shadowGradientSteps; i>=0; i--) {
                let t = i / style.shadowGradientSteps;
                let color = lerpHSL(t, style.shadowColor, style.shadowEndColor)
                let x_off = lerp_number(t, 0, style.shadowOffsetX)
                let y_off = lerp_number(t, 0, style.shadowOffsetY)
                let blur = lerp_number(t, 0, style.shadowBlurRadius)
                ctx.shadowOffsetX = x_off - bounds.w
                ctx.shadowOffsetY = y_off
                ctx.shadowBlur = blur
                ctx.shadowColor = objToHsla(color)
                ctx.fillStyle = 'red'
                ctx.fillText(text,c.x+bounds.w,c.y+0)
                ctx.shadowColor = 'transparent'
            }
        } else {
            ctx.shadowColor = objToHsla(style.shadowColor)
            // ctx.shadowColor = 'blue'
            ctx.shadowOffsetX = style.shadowOffsetX-bounds.w
            ctx.shadowOffsetY = style.shadowOffsetY
            ctx.shadowBlur = style.shadowBlurRadius
            ctx.fillStyle = 'red'
            ctx.fillText(text,c.x+bounds.w,c.y+0)
            ctx.shadowColor = 'transparent'
        }
    }

    ctx.fillStyle = objToHsla(style.color)
    ctx.fillText(text,c.x,c.y)


    ctx.restore()
}

export function PNGExportView(props: { style: Style }) {
    const [text, setText] = useState('ABC123')
    const ref = useRef(null)
    console.log("rendering style", props.style)
    useEffect(() => {
        if(ref.current) {
            // @ts-ignore
            const ctx = ref.current.getContext('2d')
            drawStyleToContext(props.style,text,ctx, new Bounds(0,0,600,400))
        }
    },[props.style,text])
    return <div className={'png-export-view'}>
        <HBox>
            <label>characters</label>
            <input type={'text'}
                   value={text}
                   onChange={(e) => setText(e.target.value)}/>
        </HBox>
        <HBox>
            <button>export</button>
        </HBox>
        <canvas style={{
            border:'1px solid red',
            width:'300px',
            height:'200px',
        }} ref={ref} width={600} height={400}></canvas>
    </div>
}
