import {
    ZodArray,
    ZodBoolean,
    ZodEffects,
    ZodEnum,
    ZodNumber,
    ZodObject,
    ZodString
} from "zod";
import React, {useState, ChangeEvent, useContext, CSSProperties, ComponentProps} from "react";
import {HBox} from "./common";
import {
    BlockPicker,
    ColorResult,
    CustomPicker,
    PhotoshopPicker,
    SketchPicker,
    SwatchesPicker
} from 'react-color';
import {HSLColor, objToHsla, Overrides, OverrideSettings} from "./model";
import {Alpha, EditableInput, Hue, Saturation} from "react-color/lib/components/common";
import {TabbedPanel, VBox} from "josh_react_util";


function NumberInput<T extends ZodNumber>(props: {
    schema: T,
    value: number,
    name: string,
    onChange: (n: number) => void,
    range: boolean
}) {
    let scale = 1
    if(!props.schema.isInt) {
        scale = 10
    }
    const update = (e:ChangeEvent<HTMLInputElement>) => {
        if (props.schema.isInt) {
            let v = parseInt(e.target.value)
            props.onChange(v)
        } else {
            let v = parseFloat(e.target.value)
            props.onChange(v/scale)
        }
    }
    return <input
        // type={props.range?"range":"number"}
        type={"range"}
        value={props.value*scale}
        min={props.schema.minValue !== null ? props.schema.minValue*scale : undefined}
        max={props.schema.maxValue !== null ? props.schema.maxValue*scale : undefined}
        onChange={update}
    />
}

function StringInput<T extends ZodString>(props: {
    schema: T,
    value: string,
    name: string,
    onChange: (n: string) => void,
}) {
    return <input
        type={"text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
    />
}

function EnumInput<T extends ZodEnum<any>>(props: {
    schema: T,
    onChange: (v: any) => void,
    name: string,
    value: any
}) {
    return <div>
        <select
            value={props.value}
            onChange={(e) => {
                props.onChange(e.target.value)
            }}>
            {
                Object.entries(props.schema.enum).map(([k, v]) => {
                    return <option key={k} value={k}>{v}</option>
                })
            }
        </select>
    </div>
}

function StringEnum<T extends ZodString>(props:{
    name:string,
    value: string,
    onChange: (v: string) => void,
    values: string[]
}) {
    return <div>
        <select
            value={props.value}
            onChange={(e) => {
                props.onChange(e.target.value)
            }}>
            {
                props.values.map(k => {
                    return <option key={k} value={k}>{k}</option>
                })
            }
        </select>
    </div>
}

function BooleanInput<T extends ZodBoolean>(props: {
    onChange: (v: any) => void,
    name: string,
    value: any,
}) {
    return <div>
        <input type={'checkbox'} checked={props.value} onChange={
            (e) => {
            props.onChange(e.target.checked)
        }}/>
    </div>
}

function ArrayInput<T extends ZodArray<any>>(props: {
    schema: T,
    onChange: (v: any[]) => void,
    name: string,
    value: any[]
}) {
    const [txt, set_txt] = useState("")
    const add = () => {
        let arr = [...props.value]
        arr.push(txt)
        props.onChange(arr)
        set_txt("")
    }
    const nuke = (index: number) => {
        let arr = props.value.slice()
        arr.splice(index, 1)
        props.onChange(arr)
    }
    return <ul>
        {props.value.map((v, i) => {
            return <li key={i}>{v}
                <button onClick={() => nuke(i)}>[x]</button>
            </li>
        })}
        <HBox>
            <input type={"text"} value={txt} onChange={(e) => set_txt(e.target.value)}
                   onKeyDown={e => {
                       if (e.code === 'Enter') add()
                   }
                   }
            />
            <button onClick={add}>add</button>
        </HBox>

    </ul>
}

function ColorSwatchButton(props:{color:HSLColor, onClick:(e:React.MouseEvent<HTMLButtonElement>)=>void}) {
    return <div className={'color-swatch-button'}>
        <button
        className={'color-swatch-button'}
        style={{backgroundColor:objToHsla(props.color)}}
        onClick={props.onClick}
    >&nbsp;</button>
        <label>{objToHsla(props.color)}</label>
    </div>
}

function MetaColorInput(props:{value: HSLColor, onChange:(v:HSLColor) => void, onClose:()=>void}) {
    return <div style={{
        position:'relative',
    }}>
        <TabbedPanel titles={['swatches','photoshop']}>
            <SwatchesPicker color={props.value} onChange={(e)=>props.onChange(e.hsl as HSLColor)}/>
            <PhotoshopPicker
                color={props.value}
                onChange={(e)=>props.onChange(e.hsl as HSLColor)}
                header={''}
                onAccept={()=>props.onClose()}
                onCancel={()=>props.onClose()}
            />
        </TabbedPanel>
        <button style={{
            position:'absolute',
            top:'0',
            right:'0',
        }} onClick={()=>props.onClose()}>x</button>
        {/*<CHSLPicker color={props.value} onChange={(e:ColorResult)=>props.onChange(e.hsl as HSLColor)}/>*/}
    </div>
}

function HSLColorInput(props: { value: HSLColor, onChange: (v:HSLColor) => void  }) {
    const [visible, setVisible] = useState(false)
    return <div className={"color-picker-wrapper"}>
        <ColorSwatchButton color={props.value} onClick={()=>setVisible(!visible)}/>
        {visible &&  <div className={'popover'}>
            <div className={'cover'}
                 // onClick={()=>setVisible(false)}
            >
                <MetaColorInput value={props.value} onChange={props.onChange} onClose={()=>setVisible(false)}/>
                {/*<SketchPicker color={props.value}*/}
                {/*              onChange={(e)=> props.onChange(e.hsl as HSLColor)}/>*/}
            </div>
        </div>}
    </div>
}

function ObjectInput<T extends ZodObject<any>>(props: {
    schema: T,
    name: string,
    onChange: (e: any) => void,
    object: any,
    overrides?:Overrides,
}) {
    const update_object_property = (k: string, v: any) => {
        // console.log("nested update",k,v)
        let new_obj = {...props.object}
        new_obj[k] = v
        props.onChange(new_obj)
    }
    return <div>
        {Object.entries(props.schema.shape).map(([key, v]) => {
            //@ts-ignore
            if(v.description && v.description === 'hsl-color') {
                return <HBox key={key}>
                    <label>{key}</label>
                    <HSLColorInput value={props.object[key]} onChange={(v) => update_object_property(key,v)} />
                    {/*<label>{props.object[k]}</label>*/}
                </HBox>
            }
            if(props.overrides && props.overrides.hasOwnProperty(key)) {
                const settings:OverrideSettings = props.overrides[key]
                if(settings.view === 'dropdown') {
                    return <HBox key={key}>
                        <label>{key}</label>
                        <StringEnum
                            name={key}
                            value={props.object[key]}
                            values={settings.values}
                            onChange={(v) => update_object_property(key, v)}
                        />
                    </HBox>
                }
            }
            if (v instanceof ZodNumber) {
                return <HBox key={key}>
                    <label>{key}</label>
                    <NumberInput range={false}
                                 schema={v}
                                 name={key}
                                 value={props.object[key]}
                                 onChange={(v) => update_object_property(key, v)}
                    />
                    <label>{props.object[key]}</label>
                </HBox>
            }
            if (v instanceof ZodString) {
                return <HBox key={key}>
                    <label>{key}</label>
                    <StringInput
                        schema={v as ZodString}
                        name={key}
                        value={props.object[key]}
                        onChange={(v) => update_object_property(key, v)}
                    />
                </HBox>
            }
            if (v instanceof ZodEnum) {
                return <HBox key={key}>
                    <label>{key}</label>
                    <EnumInput
                        schema={v as ZodEnum<any>}
                        name={key}
                        value={props.object[key]}
                        onChange={(v) => update_object_property(key, v)}
                    />
                </HBox>
            }
            if (v instanceof ZodArray) {
                // console.log("v is array",v)
                return <HBox key={key}>
                    <label>{key}</label>
                    <ArrayInput
                        schema={v as ZodArray<any>}
                        name={key}
                        value={props.object[key] as any[]}
                        onChange={(v) => update_object_property(key, v)}
                    />
                </HBox>
            }
            if (v instanceof ZodObject) {
                return <HBox key={key}>
                    <label>{key}</label>
                    <ObjectInput
                        schema={v as ZodObject<any>}
                        name={key}
                        object={props.object[key]}
                        onChange={(v) => update_object_property(key, v)}
                    />
                </HBox>
            }
            if (v instanceof ZodEffects && v._def.schema instanceof ZodObject) {
                // console.log('is a wrapped object')
                return <HBox key={key}>
                    <label>{key}</label>
                    <label>effect</label>
                    <ObjectInput
                        schema={v._def.schema as ZodObject<any>}
                        name={key}
                        object={props.object[key]}
                        onChange={(v) => update_object_property(key, v)}
                    />
                </HBox>
            }
            // console.log("child is",k,props.object[k],'schema',v)
            //@ts-ignore
            // console.log("foo", v._def)
            //@ts-ignore
            let def = v._def
            if(def.typeName === 'ZodDefault') {
                //@ts-ignore
                let def2 = def.innerType._def
                // console.log("inner type is",def2.typeName)
                if(def2.typeName) {
                    return <HBox key={key}>
                        <label>{key}</label>
                        <BooleanInput name={key}
                                      onChange={(v)=>update_object_property(key,v)}
                                      value={props.object[key]}
                        />
                    </HBox>
                }
            }
            return <div key={key}>child prop {key}</div>
        })}
    </div>
}

export function AutoForm<T>(props: {
    schema: any,
    object: any,
    onChange: (v: T) => void,
    overrides:Overrides,
}) {
    // console.log("auto form object is",props.schema, props.object)
    return <div className="auto-form">
        <ObjectInput schema={props.schema} name={"self"} onChange={props.onChange}
                     object={props.object} overrides={props.overrides}/>
    </div>
}
