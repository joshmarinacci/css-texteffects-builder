import z from "zod";
import {lerp_number} from "josh_js_util";

export type OverrideSettings = {
    view:'dropdown',
    values:any[],
}
export type Overrides = Record<string,OverrideSettings>

export const GOOGLE_FONTS = [
    {
        name:'Orbitron',
        url:'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;800;900',
        weights:[
            '400','500','600','700','800','900'
        ],
    },
    {
        name:'Playfair Display',
        url:"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900",
        weights:[
            '400','500','600','700','800','900'
        ],
        italics:true,
    },
    {
        name:'Space Mono',
        url:'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap',
        weights:['400','700'],
        italics:true,
    },
    {
        name:'Josefin Sans',
        url:'https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap',
        weights:[],
        italics:true,
    },
    {
        name:'Eczar',
        url:"https://fonts.googleapis.com/css2?family=Eczar:wght@400;500;600;700;800&display=swap",

    },
    {
        name:'Monoton',
        url:"https://fonts.googleapis.com/css2?family=Monoton&display=swap",
    },
    {
        name:'Chewy',
        url:'https://fonts.googleapis.com/css2?family=Chewy&display=swap',
    },
    {
        name:'Ewert',
        url:'https://fonts.googleapis.com/css2?family=Ewert&display=swap',
    },
    {
        name:'Bungee Shade',
        url:'https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap',
    }

]


export const StyleSchema = z.object({
    sample:z.string(),
    fontSize:z.number().min(9).max(256).int(),
    fontFamily:z.string().nonempty(),
    fontWeight:z.enum(['normal','bold','lighter','bolder','100','200','300','400','500','600','700','800','900']),
    color:z.object({
        h:z.number(),
        s:z.number(),
        l:z.number(),
        a:z.number(),
    }).describe('hsl-color'),
    backgroundColor:z.object({
        h:z.number(),
        s:z.number(),
        l:z.number(),
        a:z.number(),
    }).describe('hsl-color'),

    strokeEnabled:z.boolean().default(false),
    strokeWidth:z.number().min(0).max(10),
    strokeColor:z.object({
        h:z.number(),
        s:z.number(),
        l:z.number(),
        a:z.number(),
    }).describe('hsl-color'),

    shadowEnabled:z.boolean().default(true),
    shadowOffsetX:z.number().min(-100).max(100).int(),
    shadowOffsetY:z.number().min(-100).max(100).int(),
    shadowBlurRadius:z.number().min(0).max(100),
    shadowColor:z.object({
        h:z.number(),
        s:z.number(),
        l:z.number(),
        a:z.number(),
    }).describe('hsl-color'),

    shadowGradientEnabled:z.boolean().default(false),
    shadowGradientSteps:z.number().min(2).max(100).int(),
    shadowEndColor:z.object({
    h:z.number(),
    s:z.number(),
    l:z.number(),
    a:z.number(),
}).describe('hsl-color'),

})
export type Style = z.infer<typeof StyleSchema>;


export type HSLColor = {
    a: number
    s: number,
    h: number,
    l: number,
}

export function objToHsla(c: HSLColor): string {
    if(!c) return 'magenta'
    return `hsla(${Math.floor(c.h)},${Math.floor(c.s * 100)}%,${Math.floor(c.l * 100)}%,${c.a})`
}

export function lerpHSL(t: number, start: HSLColor, end: HSLColor) {
    let color: HSLColor = {
        h: lerp_number(t, start.h, end.h),
        s: lerp_number(t, start.s, end.s),
        l: lerp_number(t, start.l, end.l),
        a: lerp_number(t, start.a, end.a),
    }
    return color
}

export function generateCSSStyle(s: Style): Record<string, string> {
    const style: any = {
        fontSize: `${s.fontSize}px`,
        fontWeight: s.fontWeight,
        fontFamily: `"${s.fontFamily}"`,
    }
    style.color = objToHsla(s.color)
    style.backgroundColor = objToHsla(s.backgroundColor)
    const shadows:string[] = []
    if (s.strokeEnabled) {
        let r = s.strokeWidth
        let steps = 8.0
        for(let i=0; i<steps; i++) {
            let theta = i*(Math.PI*2/steps)
            let x = r * Math.cos(theta)
            let y = r * Math.sin(theta)
            shadows.push(`${x.toFixed(2)}px ${y.toFixed(2)}px 0 ${objToHsla(s.strokeColor)}`);
        }
    }

    if (s.shadowEnabled) {
        if (s.shadowGradientEnabled) {
            for (let i = 0; i < s.shadowGradientSteps + 1; i++) {
                let t = i / s.shadowGradientSteps;
                let color = lerpHSL(t, s.shadowColor, s.shadowEndColor)
                let x_off = lerp_number(t, 0, s.shadowOffsetX)
                let y_off = lerp_number(t, 0, s.shadowOffsetY)
                let blur = lerp_number(t, 0, s.shadowBlurRadius)
                let tf = ` ${x_off}px ${y_off}px ${blur}px ${objToHsla(color)}`
                shadows.push(tf)
            }
        } else {
            shadows.push(`${s.shadowOffsetX}px ${s.shadowOffsetY}px ${s.shadowBlurRadius}px ${objToHsla(s.shadowColor)}`)
        }
    }
    style.textShadow = shadows.join(',\n    ')
    return style
}

export const default_style: Style = {
    fontSize: 20,
    sample: 'abc123',
    fontFamily: 'system-ui',
    fontWeight: 'bold',
    color: {
        h: 30,
        s: 1,
        l: 0.5,
        a: 1.0,
    },

    strokeEnabled: false,
    strokeWidth: 3,
    strokeColor: {h: 52, s: 0.01, l: 0.81, a: 1.0},

    shadowOffsetX: 3,
    shadowOffsetY: 3,
    shadowBlurRadius: 3,
    shadowEnabled: true,
    shadowColor: {
        h: 0,
        s: 0,
        l: 0,
        a: 1.0,
    },
    backgroundColor: {
        h: 0.5,
        s: 1.0,
        l: 0.5,
        a: 1.0,
    },
    shadowGradientEnabled: false,
    shadowGradientSteps: 2,
    shadowEndColor: {
        h: 0.5,
        s: 1.0,
        l: 0.5,
        a: 1.0,
    },
}
