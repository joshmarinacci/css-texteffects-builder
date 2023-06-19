import z from "zod";


export const StyleSchema = z.object({
    sample:z.string(),
    fontSize:z.number().min(9).max(256).int(),
    fontFamily:z.enum([
        'serif',
        'sans-serif',
        'monospace',
        'cursive',
        'fantasy',
        'system-ui'
    ]),
    fontWeight:z.enum(['normal','bold','100']),
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
