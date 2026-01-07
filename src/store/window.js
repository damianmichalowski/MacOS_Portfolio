import { INITIAL_Z_INDEX, WINDOW_CONFIG } from '#constants'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const isWindowKeyOfType = (key, type) =>
  key === type || key.startsWith(`${type}:`)

const getWindowIdentity = (data) => {
  if (!data) return null
  return (
    data.windowId ??
    data.uid ??
    data.path ??
    (data.name ? `name:${data.name}` : null)
  )
}

const findOpenWindowKeyByIdentity = (windows, type, identity) => {
  if (identity == null) return null
  for (const [key, win] of Object.entries(windows)) {
    if (!isWindowKeyOfType(key, type)) continue
    if (!win?.isOpen) continue
    if (getWindowIdentity(win?.data) === identity) return key
  }
  return null
}

const openMultiInstanceWindow = (state, type, data) => {
  const identity = getWindowIdentity(data)
  const reuseKey = findOpenWindowKeyByIdentity(state.windows, type, identity)

  const targetKey =
    reuseKey ??
    (state.windows[type]?.isOpen
      ? `${type}:${identity ?? Date.now()}:${state.nextZIndex}`
      : type)

  if (!state.windows[targetKey]) {
    state.windows[targetKey] = {
      isOpen: false,
      isMaximized: false,
      zIndex: INITIAL_Z_INDEX,
      data: null,
    }
  }

  const win = state.windows[targetKey]
  win.isOpen = true
  win.zIndex = state.nextZIndex
  win.data = data ?? win.data
  state.nextZIndex++
}

const shouldDeleteWindowOnClose = (windowKey) =>
  windowKey.startsWith('txtfile:') || windowKey.startsWith('imgfile:')

const useWindowStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        if (windowKey === 'txtfile')
          return openMultiInstanceWindow(state, 'txtfile', data)
        if (windowKey === 'imgfile')
          return openMultiInstanceWindow(state, 'imgfile', data)

        const win = state.windows[windowKey]
        if (!win) return
        win.isOpen = true
        win.isMaximized = win.isMaximized ?? false
        win.zIndex = state.nextZIndex
        win.data = data ?? win.data
        state.nextZIndex++
      }),

    minimizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey]
        if (!win) return
        win.isOpen = false
        win.isMaximized = false
      }),

    maximizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey]
        if (!win) return
        win.isOpen = true
        win.isMaximized = !win.isMaximized
        win.zIndex = state.nextZIndex
        state.nextZIndex++
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey]
        if (!win) return
        win.isOpen = false
        win.isMaximized = false
        win.zIndex = INITIAL_Z_INDEX
        win.data = null

        if (shouldDeleteWindowOnClose(windowKey)) {
          delete state.windows[windowKey]
        }
      }),
    focusWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey]
        if (!win) return
        win.zIndex = state.nextZIndex++
      }),
    //TODO add minimize and maximize
  }))
)

export default useWindowStore
