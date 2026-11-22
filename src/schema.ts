import type { ZodType } from 'zod'
import { useEffect, useState } from 'react'

export function start_doc<T>(schema: ZodType<T>, backup: unknown): T {
  const start_box = schema.parse(backup)
  try {
    let q = window.location.search
    if (q && q.startsWith('?data=')) {
      q = q.substring(6)
      const json = decodeURIComponent(q)
      return schema.parse(JSON.parse(json))
    }
  } catch (e) {
    console.log('error happened', e)
  }
  return start_box
}

let debounce_timer: ReturnType<typeof setTimeout> | undefined
function debounce(callback: () => void, time: number) {
  clearTimeout(debounce_timer)
  debounce_timer = setTimeout(callback, time)
}
export function save_doc<T>(new_box: T) {
  debounce(() => {
    const str = encodeURIComponent(JSON.stringify(new_box))
    window.history.pushState(new_box, 'box-state', '?data=' + str)
  }, 1000)
}

export function useHistoryDoc<A>(schema: ZodType<A>, default_box: A): [A, (a: A) => void] {
  const [box, set_box] = useState<A>(() => start_doc<A>(schema, default_box))
  const do_set_box = (box: A) => {
    set_box(box)
    save_doc<A>(box)
  }
  useEffect(() => {
    const history_changed = (event: PopStateEvent) => {
      try {
        // Restoring from history must not push a new history entry.
        set_box(schema.parse(event.state))
      } catch {
        console.log('error restoring from history')
      }
    }
    window.addEventListener('popstate', history_changed)
    return () => {
      window.removeEventListener('popstate', history_changed)
    }
  }, [schema])
  return [box, do_set_box]
}
