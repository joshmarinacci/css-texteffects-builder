import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { PRESETS } from './presets'

beforeEach(() => {
  window.history.replaceState(null, '', '/')
})

function preview() {
  return screen.getByRole('region', { name: 'Preview' })
}

test('renders the app shell', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CSS Text Effects Builder')
  expect(screen.getByRole('complementary', { name: 'Inspector' })).toBeInTheDocument()
  expect(preview()).toHaveTextContent('abc123')
})

test('inspector controls are labelled', () => {
  render(<App />)
  expect(screen.getByRole('textbox', { name: 'Text' })).toHaveValue('abc123')
  expect(screen.getByRole('combobox', { name: 'Font' })).toBeInTheDocument()
  expect(screen.getByRole('slider', { name: 'Size' })).toHaveValue('20')
  expect(screen.getAllByRole('switch', { name: 'Enabled' })).toHaveLength(2)
})

test('editing the sample text updates the preview', async () => {
  const user = userEvent.setup()
  render(<App />)
  const input = screen.getByRole('textbox', { name: 'Text' })
  await user.clear(input)
  await user.type(input, 'Hello')
  expect(preview()).toHaveTextContent('Hello')
})

test('choosing a preset applies it', async () => {
  const user = userEvent.setup()
  render(<App />)
  const presets = screen.getByRole('group', { name: 'Presets' })
  await user.click(within(presets).getByRole('button', { name: 'Fire' }))
  expect(preview()).toHaveTextContent('Fire')
  expect(screen.getByRole('combobox', { name: 'Font' })).toHaveValue('Orbitron')
})

test('toggling the stroke switch adds stroke shadow layers', async () => {
  const user = userEvent.setup()
  render(<App />)
  const footer = screen.getByRole('contentinfo')
  expect(footer).toHaveTextContent('1 shadow layers')
  const [strokeSwitch] = screen.getAllByRole('switch', { name: 'Enabled' })
  await user.click(strokeSwitch)
  expect(strokeSwitch).toBeChecked()
  expect(footer).toHaveTextContent('9 shadow layers')
})

test('color picker opens from its swatch and closes with Escape', async () => {
  const user = userEvent.setup()
  render(<App />)
  const button = screen.getByRole('button', { name: /^Background/ })
  expect(button).toHaveAttribute('aria-expanded', 'false')
  await user.click(button)
  expect(button).toHaveAttribute('aria-expanded', 'true')
  const picker = document.getElementById(button.getAttribute('aria-controls')!)!
  expect(picker).toBeInTheDocument()
  await user.click(within(picker).getAllByRole('textbox')[0])
  await user.keyboard('{Escape}')
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(button).toHaveFocus()
})

// Regression: restoring from history used to push a new history entry,
// which broke the browser's Back/Forward buttons.
test('restoring state from history does not push a new entry', () => {
  vi.useFakeTimers()
  try {
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<App />)
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate', { state: PRESETS.get('Hotdog') }))
    })
    expect(preview()).toHaveTextContent('hotdog')
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(pushState).not.toHaveBeenCalled()
    pushState.mockRestore()
  } finally {
    vi.useRealTimers()
  }
})
