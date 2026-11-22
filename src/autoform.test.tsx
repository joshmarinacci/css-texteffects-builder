import { fireEvent, render, screen } from '@testing-library/react'
import { z } from 'zod'
import { AutoForm } from './autoform'

const schema = z.object({
  width: z.number().min(0).max(10),
  count: z.number().min(0).max(100).int(),
  enabled: z.boolean().default(false),
  mode: z.enum(['a', 'b']),
})
const value = { width: 1.5, count: 4, enabled: false, mode: 'a' as const }

test('labels default to the humanized key', () => {
  render(<AutoForm schema={schema} object={value} onChange={() => {}} />)
  expect(screen.getByRole('slider', { name: 'width' })).toBeInTheDocument()
  expect(screen.getByRole('switch', { name: 'enabled' })).not.toBeChecked()
  expect(screen.getByRole('combobox', { name: 'mode' })).toHaveValue('a')
})

test('fields picks, orders and labels rows', () => {
  render(
    <AutoForm
      schema={schema}
      object={value}
      onChange={() => {}}
      fields={{ count: 'Count', width: 'Width' }}
    />,
  )
  expect(screen.getAllByRole('slider').map((s) => s.closest('label')?.textContent)).toEqual([
    'Count4',
    'Width1.5',
  ])
  expect(screen.queryByRole('switch')).not.toBeInTheDocument()
})

test('fractional sliders are scaled by 10, integer sliders are not', () => {
  const onChange = vi.fn()
  render(<AutoForm schema={schema} object={value} onChange={onChange} />)
  const width = screen.getByRole('slider', { name: 'width' })
  expect(width).toHaveValue('15')
  expect(width).toHaveAttribute('max', '100')
  expect(width).toHaveAttribute('aria-valuetext', '1.5')
  fireEvent.change(width, { target: { value: '25' } })
  expect(onChange).toHaveBeenLastCalledWith({ ...value, width: 2.5 })

  fireEvent.change(screen.getByRole('slider', { name: 'count' }), { target: { value: '7' } })
  expect(onChange).toHaveBeenLastCalledWith({ ...value, count: 7 })
})
