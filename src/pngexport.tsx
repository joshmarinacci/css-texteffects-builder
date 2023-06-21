import {lerpHSL, objToHsla, Style} from "./model";
import React, {useEffect, useRef, useState} from "react";
import {HBox, VBox} from "josh_react_util";
import {Bounds, lerp_number, Point} from "josh_js_util";
import {canvas_to_blob, forceDownloadBlob} from "josh_web_util";

function drawStyleToContext(style: Style, fullText: string, ctx: CanvasRenderingContext2D, bounds: Bounds, forExport:boolean) {
    console.log("font size is",style.fontSize)
    const size = style.fontSize
    ctx.save()
    ctx.fillStyle = objToHsla(style.backgroundColor)
    ctx.fillRect(bounds.x,bounds.y,bounds.w,bounds.h)


    function drawLetter(letter:string,bds:Bounds) {
        ctx.save()
        let font = `${style.fontWeight} ${style.fontSize}px "${style.fontFamily}"`
        let pt = bds.bottom_midpoint()
        ctx.font = font
        ctx.textAlign = 'center'
        if(style.strokeEnabled) {
            let r = style.strokeWidth
            let steps = 8.0
            for(let i=0; i<steps; i++) {
                let theta = i*(Math.PI*2/steps)
                let x_off = r * Math.cos(theta)
                let y_off = r * Math.sin(theta)
                ctx.shadowOffsetX = x_off - bounds.w
                ctx.shadowOffsetY = y_off
                ctx.shadowBlur = 0
                ctx.shadowColor = objToHsla(style.strokeColor)
                ctx.fillStyle = 'red'
                ctx.fillText(letter,pt.x+bounds.w,pt.y)
                ctx.shadowColor = 'transparent'
            }
        }
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
                    ctx.fillText(letter,pt.x+bounds.w,pt.y+0)
                    ctx.shadowColor = 'transparent'
                }
            } else {
                ctx.shadowColor = objToHsla(style.shadowColor)
                // ctx.shadowColor = 'blue'
                ctx.shadowOffsetX = style.shadowOffsetX-bounds.w
                ctx.shadowOffsetY = style.shadowOffsetY
                ctx.shadowBlur = style.shadowBlurRadius
                ctx.fillStyle = 'red'
                ctx.fillText(letter,pt.x+bounds.w,pt.y+0)
                ctx.shadowColor = 'transparent'
            }
        }
        ctx.fillStyle = objToHsla(style.color)
        ctx.fillText(letter,pt.x,pt.y)
        ctx.restore()
    }

    Array.from(fullText).forEach((letter,i) => {
        // let pt = new Point(0+size*i,80)
        let bds = new Bounds(0+size*i,size,size,size)
        bds = bds.add(new Point(0,-size))
        drawLetter(letter,bds)
        if(!forExport) {
            ctx.strokeStyle = 'black'
            ctx.strokeRect(bds.x, bds.y, bds.w, bds.h)
        }
    })
    if(!forExport) {
        ctx.fillStyle = 'black'
        ctx.font = '30px sans-serif';
        ctx.fillText(`sprite size ${size}`,20,300-20)
    }

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
            drawStyleToContext(props.style,text,ctx, new Bounds(0,0,1000,500),false)
        }
    },[props.style,text])
    const exportCanvas = async () => {
        if (ref.current) {
            const canvas = document.createElement('canvas')
            canvas.width = props.style.fontSize * text.length
            canvas.height = props.style.fontSize
            let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
            drawStyleToContext(props.style,text,ctx, new Bounds(0,0,canvas.width,canvas.height),true)
            let blob = await canvas_to_blob(canvas)
            forceDownloadBlob('output.png',blob)
        }
    }
    return <div className={'png-export-view'}>
        <HBox>
            <label>characters</label>
            <input type={'text'}
                   value={text}
                   onChange={(e) => setText(e.target.value)}/>
        </HBox>
        <HBox>
            <button onClick={exportCanvas}>export</button>
        </HBox>
        <canvas style={{
            border:'1px solid red',
            width:'500px',
            height:'200px',
        }} ref={ref} width={1000} height={400}></canvas>
    </div>
}
