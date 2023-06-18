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
    strokeEnabled:z.boolean().default(false).describe('foo'),
    strokeWidth:z.number().min(0).max(20)
})
export type Style = z.infer<typeof StyleSchema>;


