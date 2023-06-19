import z from "zod";

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
    }

]


export const StyleSchema = z.object({
    sample:z.string(),
    fontSize:z.number().min(9).max(256).int(),
    fontFamily:z.enum([
        'serif',
        'sans-serif',
        'monospace',
        'cursive',
        'fantasy',
        'system-ui',
        'Orbitron',
        'Playfair Display',
        'Space Mono',
        'Josefin Sans',
        'Eczar',
        'Monoton',
        'Chewy',
        'Ewert',
    ]),
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
    strokeWidth:z.number().min(0).max(20),

    shadowEnabled:z.boolean().default(true),
    shadowOffsetX:z.number().min(-30).max(30),
    shadowOffsetY:z.number().min(-30).max(30),
    shadowBlurRadius:z.number().min(0).max(20),
    shadowColor:z.object({
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
    return `hsla(${Math.floor(c.h)},${Math.floor(c.s * 100)}%,${Math.floor(c.l * 100)}%,${c.a})`
}
