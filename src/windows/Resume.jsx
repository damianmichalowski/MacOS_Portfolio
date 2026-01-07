import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import { Download } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const Resume = () => {
  const { windows } = useWindowStore()
  const isMaximized = windows?.resume?.isMaximized
  const containerRef = useRef(null)
  const [pageWidth, setPageWidth] = useState(null)

  useLayoutEffect(() => {
    // Only auto-fit the PDF when maximized.
    if (!isMaximized) {
      setPageWidth(null)
      return
    }

    const el = containerRef.current
    if (!el) return

    const update = () => {
      // Small padding so the PDF isn't flush to the edges.
      const nextWidth = Math.max(320, el.clientWidth - 24)
      setPageWidth(nextWidth)
    }

    // Wait a frame so layout has settled after fullscreen toggle.
    const raf = requestAnimationFrame(update)

    const ro = new ResizeObserver(() => update())
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [isMaximized])

  const pageProps = useMemo(() => {
    if (!isMaximized) return {}
    return pageWidth ? { width: pageWidth } : {}
  }, [isMaximized, pageWidth])

  return (
    <div className={isMaximized ? 'flex flex-col h-full' : undefined}>
      <div id="window-header">
        <WindowControls target="resume" />
        <h2>Resume.pdf</h2>

        <a href="files/resume.pdf" download title="Download resume">
          <Download className="icon cursor-pointer" />
        </a>
      </div>

      <div
        ref={containerRef}
        className={isMaximized ? 'flex-1 overflow-auto' : undefined}
      >
        <Document file="files/resume.pdf">
          <Page
            key={isMaximized ? 'max' : 'default'}
            pageNumber={1}
            {...pageProps}
            renderTextLayer
            renderAnnotationLayer
          />
        </Document>
      </div>
    </div>
  )
}

const ResumeWindow = WindowWrapper(Resume, 'resume')

export default ResumeWindow
