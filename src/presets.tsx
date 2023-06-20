import {HSLColor, Style} from "./model";
import React from "react";

const presets = new Map<string, Style>()

presets.set('Hotdog',{
    sample:'hotdog',
    fontSize: 150,
    fontFamily: 'sans-serif',
    color: {
        h: 16,
        s: 1.0,
        l: 0.5,
        a: 1.0,
    },
    strokeEnabled: false,
    shadowEnabled: true,
    strokeColor: {h: 52,s:0.01,l:0.81,a:1.0},
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowBlurRadius: 0,
    backgroundColor: { h: 0, s: 1, l:1, a:1},
    shadowColor: { h: 53, s: 0.95, l:0.7, a:1},
    fontWeight: 'bold',
    strokeWidth: 0,
    shadowGradientEnabled: false,
    shadowGradientSteps:2,
    shadowEndColor: { h: 0, s: 1, l:1, a:1},
})
presets.set('Green Neon',{
    sample:'neon',
    fontSize: 150,
    fontFamily: 'sans-serif',
    fontWeight: '100',
    color: { h:117, s:0.38,l:0.44,a:1.0},
    backgroundColor: { h:117, s:0.0, l:0.0, a:1.0},
    strokeEnabled: false,
    strokeWidth: 0,
    strokeColor: {h: 52,s:0.01,l:0.81,a:1.0},
    shadowEnabled: true,
    shadowOffsetX: 0,
    shadowOffsetY: 5,
    shadowBlurRadius: 20,
    shadowColor: {h: 52,s:0.39,l:0.97,a:1.0},
    shadowGradientEnabled: false,
    shadowGradientSteps:2,
    shadowEndColor: { h: 0, s: 1, l:1, a:1},
})
const WHITE:HSLColor = {
    h:0, s:0, l:1, a:1
}
presets.set('only shadow', {
    sample:'SHADOWS',
    fontSize: 127,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    color: WHITE,
    backgroundColor: WHITE,
    strokeEnabled: false,
    strokeWidth: 0,
    strokeColor: {h: 52,s:0.01,l:0.81,a:1.0},
    shadowEnabled: true,
    shadowOffsetX: -16,
    shadowOffsetY: 0,
    shadowBlurRadius: 20,
    shadowColor: {h: 52,s:0.01,l:0.81,a:1.0},
    shadowGradientEnabled: false,
    shadowGradientSteps:2,
    shadowEndColor: { h: 0, s: 1, l:1, a:1},
})
presets.set('Fire', {
    sample: "Fire",
    fontSize: 216,
    fontFamily: "Orbitron",
    fontWeight: "bold",
    color: { h:52, s:0, l:0, a:1 },
    backgroundColor: { h:3.9418562068495633, s:0, l:0, a:1 },
    strokeEnabled: true,
    strokeWidth: 3,
    strokeColor: { h:52.000000000000234, s:0, l:0, a:1 },
    shadowEnabled: true,
    shadowOffsetX: 6.5,
    shadowOffsetY: -100,
    shadowBlurRadius: 68.8,
    shadowColor: { h:63.627894201944045, s:1, l:0.5, a:1 },
    shadowGradientEnabled: true,
    shadowGradientSteps: 25,
    shadowEndColor: { h:0, s:1, l:0.5, a:1 }})
presets.set('70s fade',{
    sample: "12:57",
    fontSize: 204,
    fontFamily: "sans-serif",
    fontWeight: "bold",
    color: { h:19.604655421057412, s:0.9796055596823229, l:0.5439933699999999, a:1 },
    backgroundColor: { h:52.00000000000024, s:1, l:0.94965, a:1 },
    strokeEnabled: false,
    strokeWidth: 0.5,
    strokeColor: { h:52.000000000000234, s:0, l:0, a:1 },
    shadowEnabled: true,
    shadowOffsetX: 41,
    shadowOffsetY: 100,
    shadowBlurRadius: 0,
    shadowColor: { h:52.00000000000001, s:1, l:0.97585, a:1 },
    shadowGradientEnabled: true,
    shadowGradientSteps: 100,
    shadowEndColor: { h:14.930228299872814, s:1, l:0.4987, a:1 }})
presets.set('black geometric',{
    sample: "12:57",
    fontSize: 204,
    fontFamily: "sans-serif",
    fontWeight: "bold",
    color: { h:52, s:0, l:0, a:1 },
    backgroundColor: { h:153.59301899754726, s:1, l:0.8915000000000001, a:1 },
    strokeEnabled: true,
    strokeWidth: 1.4,
    strokeColor: { h:52.00000000000003, s:0, l:1, a:1 },
    shadowEnabled: true,
    shadowOffsetX: 2,
    shadowOffsetY: 15,
    shadowBlurRadius: 0,
    shadowColor: { h:52.000000000000234, s:0, l:0, a:1 },
    shadowGradientEnabled: true,
    shadowGradientSteps: 27,
    shadowEndColor: { h:14.930228299873056, s:0.02030405060708103, l:0.09546173999999999, a:1 }})
presets.set('doop',{
    sample: "doop",
    fontSize: 137,
    fontFamily: "Josefin Sans",
    fontWeight: "600",
    color: { h:138.59304028888081, s:0, l:0, a:1 },
    backgroundColor: { h:352.71844660194176, s:0.980952380952381, l:0.4117647058823529, a:1 },
    strokeEnabled: false,
    strokeWidth: 0.8,
    strokeColor: { h:52.000000000000234, s:1, l:0.5, a:1 },
    shadowEnabled: true,
    shadowOffsetX: 0,
    shadowOffsetY: 100,
    shadowBlurRadius: 0,
    shadowColor: { h:55.36363636363636, s:0.9401709401709404, l:0.5411764705882353, a:1 },
    shadowGradientEnabled: true,
    shadowGradientSteps: 22,
    shadowEndColor: { h:37.42857142857143, s:0.9130434782608696, l:0.5490196078431373, a:1 }
})

export const PRESETS = presets

export function PresetsList(props: { setStyle: (style: Style) => void }) {
    return <div className={"vbox presets"}>
        <h3>Presets</h3>
        {Array.from(PRESETS.keys()).map(key => {
            return <button className={'preset'} key={key}
                           onClick={() => props.setStyle(PRESETS.get(key) as Style)}>{key}</button>

        })}
    </div>;
}
