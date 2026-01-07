import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { useLayoutEffect, useRef } from 'react'

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore()
    const resolvedWindowKey = windowKey ?? props.windowKey
    const resolvedWindowType =
      props.windowType ??
      (resolvedWindowKey ? resolvedWindowKey.split(':')[0] : null)

    const winState = resolvedWindowKey ? windows?.[resolvedWindowKey] : null
    const isOpen = winState?.isOpen
    const isMaximized = winState?.isMaximized
    const zIndex = winState?.zIndex
    const ref = useRef(null)
    const prevTransformRef = useRef(null)

    useGSAP(() => {
      const el = ref.current
      if (!el || !isOpen) return

      el.style.display = 'block'

      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      )
    }, [isOpen])

    useGSAP(() => {
      const el = ref.current
      if (!el) return

      if (isMaximized) return

      const header = el.querySelector('#window-header') || el
      const [instance] = Draggable.create(el, {
        trigger: header,
      })

      const onPointerDown = () => {
        if (resolvedWindowKey) focusWindow(resolvedWindowKey)
      }

      el.addEventListener('pointerdown', onPointerDown)

      return () => {
        instance.kill()
        el.removeEventListener('pointerdown', onPointerDown)
      }
    }, [focusWindow, resolvedWindowKey, isMaximized])

    useLayoutEffect(() => {
      const el = ref.current
      if (!el) return

      if (isMaximized) {
        prevTransformRef.current = el.style.transform || null
        el.style.transform = 'none'
        return
      }

      if (prevTransformRef.current != null) {
        el.style.transform = prevTransformRef.current
      } else {
        el.style.removeProperty('transform')
      }
    }, [isMaximized])

    useLayoutEffect(() => {
      const el = ref.current
      if (!el) return
      el.style.display = isOpen ? 'block' : 'none'
    }, [isOpen])

    if (!resolvedWindowKey) return null

    return (
      <section
        id={resolvedWindowKey}
        data-window-type={resolvedWindowType}
        ref={ref}
        style={
          isMaximized
            ? {
                zIndex,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
              }
            : { zIndex }
        }
        className="absolute"
      >
        <Component {...props} windowKey={resolvedWindowKey} />
      </section>
    )
  }

  Wrapped.displayName = `WindowWrapper(${
    Component.displayName || Component.name || 'Component'
  })`

  return Wrapped
}

export default WindowWrapper
