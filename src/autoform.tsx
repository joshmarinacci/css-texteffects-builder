import { ZodBoolean, ZodDefault, ZodEnum, ZodNumber, ZodObject, ZodString, ZodType } from 'zod'
import { ChangeEvent, useId, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import { HSLColor, objToHsla, Overrides } from './model'

/** Turns `shadowBlurRadius` into `shadow blur radius`. */
function humanize(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
}

function NumberRow(props: {
  label: string
  schema: ZodNumber
  value: number
  onChange: (n: number) => void
}) {
  const { schema } = props
  // Ranges only step in integers, so fractional fields are scaled by 10.
  const scale = schema.isInt ? 1 : 10
  const update = (e: ChangeEvent<HTMLInputElement>) => {
    if (schema.isInt) {
      props.onChange(parseInt(e.target.value))
    } else {
      props.onChange(parseFloat(e.target.value) / scale)
    }
  }
  return (
    <label>
      <span>{props.label}</span>
      <input
        type="range"
        value={props.value * scale}
        min={schema.minValue !== null ? schema.minValue * scale : undefined}
        max={schema.maxValue !== null ? schema.maxValue * scale : undefined}
        aria-valuetext={String(props.value)}
        onChange={update}
      />
      {/* Visual readout only; the slider announces its value via aria-valuetext. */}
      <output aria-hidden="true">{props.value}</output>
    </label>
  )
}

function TextRow(props: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label>
      <span>{props.label}</span>
      <input type="text" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
    </label>
  )
}

function SelectRow(props: {
  label: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  return (
    <label>
      <span>{props.label}</span>
      <select value={props.value} onChange={(e) => props.onChange(e.target.value)}>
        {props.options.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </label>
  )
}

function SwitchRow(props: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label>
      <span>{props.label}</span>
      <input
        type="checkbox"
        role="switch"
        checked={props.value}
        onChange={(e) => props.onChange(e.target.checked)}
      />
    </label>
  )
}

// react-color draws its own chrome inline; blend it into the inspector.
const PICKER_STYLES = {
  default: {
    picker: {
      background: 'var(--surface-2)',
      boxShadow: 'none',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
    },
  },
}

function ColorRow(props: { label: string; value: HSLColor; onChange: (v: HSLColor) => void }) {
  const [open, setOpen] = useState(false)
  const pickerId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const css = objToHsla(props.value)
  return (
    <>
      <label>
        <span>{props.label}</span>
        <button
          ref={buttonRef}
          type="button"
          className="color-button"
          aria-expanded={open}
          aria-controls={pickerId}
          onClick={() => setOpen(!open)}
        >
          <span className="swatch" style={{ backgroundColor: css }} />
          {css}
        </button>
      </label>
      {open && (
        <div
          id={pickerId}
          className="color-picker"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false)
              // The picker unmounts, so hand focus back to its toggle.
              buttonRef.current?.focus()
            }
          }}
        >
          <SketchPicker
            color={props.value}
            width="calc(100% - 20px)"
            styles={PICKER_STYLES}
            onChange={(c) => props.onChange(c.hsl as HSLColor)}
          />
        </div>
      )}
    </>
  )
}

function FieldRow(props: {
  name: string
  label: string
  schema: ZodType
  value: unknown
  overrides?: Overrides
  onChange: (v: unknown) => void
}) {
  const { schema, value, label, onChange } = props
  const override = props.overrides?.[props.name]
  if (schema instanceof ZodObject && schema.description === 'hsl-color') {
    return <ColorRow label={label} value={value as HSLColor} onChange={onChange} />
  }
  if (override?.view === 'dropdown') {
    return (
      <SelectRow
        label={label}
        value={String(value)}
        options={override.values}
        onChange={onChange}
      />
    )
  }
  if (schema instanceof ZodNumber) {
    return <NumberRow label={label} schema={schema} value={value as number} onChange={onChange} />
  }
  if (schema instanceof ZodString) {
    return <TextRow label={label} value={value as string} onChange={onChange} />
  }
  if (schema instanceof ZodEnum) {
    return (
      <SelectRow
        label={label}
        value={String(value)}
        options={schema.options as string[]}
        onChange={onChange}
      />
    )
  }
  if (
    schema instanceof ZodBoolean ||
    (schema instanceof ZodDefault && schema.def.innerType instanceof ZodBoolean)
  ) {
    return <SwitchRow label={label} value={value as boolean} onChange={onChange} />
  }
  return (
    <p>
      <small>{label}: unsupported field type</small>
    </p>
  )
}

/**
 * Renders one property row per field of a Zod object schema.
 * `fields` maps schema keys to row labels and sets their order; by default every key is shown.
 */
export function AutoForm<T extends object>(props: {
  schema: ZodObject
  object: T
  onChange: (v: T) => void
  overrides?: Overrides
  fields?: Record<string, string>
}) {
  const shape = props.schema.shape
  const fields = props.fields ?? Object.fromEntries(Object.keys(shape).map((k) => [k, humanize(k)]))
  const values = props.object as Record<string, unknown>
  return (
    <>
      {Object.entries(fields).map(([key, label]) => (
        <FieldRow
          key={key}
          name={key}
          label={label}
          schema={shape[key]}
          value={values[key]}
          overrides={props.overrides}
          onChange={(v) => props.onChange({ ...props.object, [key]: v })}
        />
      ))}
    </>
  )
}
