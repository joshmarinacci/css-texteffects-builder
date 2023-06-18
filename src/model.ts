import z from "zod";

export type TextStyle = {
    sample:string
    fontSize:number
}

export const StyleSchema = z.object({
    sample:z.string(),
    fontSize:z.number().min(9).max(100).int(),
})
export type Style = z.infer<typeof StyleSchema>;


