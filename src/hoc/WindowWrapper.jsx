import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { useLayoutEffect, useRef } from 'react'

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore()
    const { isOpen, zIndex } = windows[windowKey]
    const ref = useRef(null)

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

      const header = el.querySelector('#window-header') || el
      const [instance] = Draggable.create(el, {
        trigger: header,
      })

      const onPointerDown = () => {
        focusWindow(windowKey)
      }

      el.addEventListener('pointerdown', onPointerDown)

      return () => {
        instance.kill()
        el.removeEventListener('pointerdown', onPointerDown)
      }
    }, [focusWindow, windowKey])

    useLayoutEffect(() => {
      const el = ref.current
      if (!el) return
      el.style.display = isOpen ? 'block' : 'none'
    }, [isOpen])

    return (
      <section id={windowKey} ref={ref} style={{ zIndex }} className="absolute">
        <Component {...props} />
      </section>
    )
  }

  Wrapped.displayName = `WindowWrapper(${
    Component.displayName || Component.name || 'Component'
  })`

  return Wrapped
}

export default WindowWrapper
