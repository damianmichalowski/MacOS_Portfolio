import { INITIAL_Z_INDEX, WINDOW_CONFIG } from '#constants'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const isTxtFileWindowKey = (key) =>
  key === 'txtfile' || key.startsWith('txtfile:')

const isImgFileWindowKey = (key) =>
  key === 'imgfile' || key.startsWith('imgfile:')

const getTxtFileIdentity = (data) => {
  if (!data) return null
  return (
    data.windowId ??
    data.uid ??
    data.path ??
    (data.name ? `name:${data.name}` : null) ??
    null
  )
}

const findOpenTxtFileWindowKeyByIdentity = (windows, identity) => {
  if (identity == null) return null
  for (const [key, win] of Object.entries(windows)) {
    if (!isTxtFileWindowKey(key)) continue
    if (!win?.isOpen) continue
    if (getTxtFileIdentity(win?.data) === identity) return key
  }
  return null
}

const getImgFileIdentity = (data) => {
  if (!data) return null
  return (
    data.windowId ??
    data.uid ??
    data.path ??
    (data.name ? `name:${data.name}` : null) ??
    null
  )
}

const findOpenImgFileWindowKeyByIdentity = (windows, identity) => {
  if (identity == null) return null
  for (const [key, win] of Object.entries(windows)) {
    if (!isImgFileWindowKey(key)) continue
    if (!win?.isOpen) continue
    if (getImgFileIdentity(win?.data) === identity) return key
  }
  return null
}

const useWindowStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        if (windowKey === 'txtfile') {
          const identity = getTxtFileIdentity(data)
          const reuseKey = findOpenTxtFileWindowKeyByIdentity(
            state.windows,
            identity
          )
          const targetKey =
            reuseKey ??
            (state.windows.txtfile?.isOpen
              ? `txtfile:${identity ?? Date.now()}:${state.nextZIndex}`
              : 'txtfile')

          if (!state.windows[targetKey]) {
            state.windows[targetKey] = {
              isOpen: false,
              zIndex: INITIAL_Z_INDEX,
              data: null,
            }
          }

          const win = state.windows[targetKey]
          win.isOpen = true
          win.zIndex = state.nextZIndex
          win.data = data ?? win.data
          state.nextZIndex++
          return
        }

        if (windowKey === 'imgfile') {
          const identity = getImgFileIdentity(data)
          const reuseKey = findOpenImgFileWindowKeyByIdentity(
            state.windows,
            identity
          )

          const targetKey =
            reuseKey ??
            (state.windows.imgfile?.isOpen
              ? `imgfile:${identity ?? Date.now()}:${state.nextZIndex}`
              : 'imgfile')

          if (!state.windows[targetKey]) {
            state.windows[targetKey] = {
              isOpen: false,
              zIndex: INITIAL_Z_INDEX,
              data: null,
            }
          }

          const win = state.windows[targetKey]
          win.isOpen = true
          win.zIndex = state.nextZIndex
          win.data = data ?? win.data
          state.nextZIndex++
          return
        }

        const win = state.windows[windowKey]
        if (!win) return
        win.isOpen = true
        win.zIndex = state.nextZIndex
        win.data = data ?? win.data
        state.nextZIndex++
      }),
    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey]
        if (!win) return
        win.isOpen = false
        win.zIndex = INITIAL_Z_INDEX
        win.data = null

        if (windowKey.startsWith('txtfile:')) {
          delete state.windows[windowKey]
        }

        if (windowKey.startsWith('imgfile:')) {
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
