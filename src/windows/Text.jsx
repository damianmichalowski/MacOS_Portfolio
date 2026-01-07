import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'

const TextFile = ({ windowKey }) => {
  const { windows } = useWindowStore()
  const data = windows?.[windowKey]?.data

  if (!data) return null

  const title = data.name
  const subtitle = data.subtitle
  const image = data.image ?? data.imageUrl
  const description = Array.isArray(data.description) ? data.description : []

  return (
    <>
      <div id="window-header">
        <WindowControls target={windowKey} />
        <h2>{title}</h2>
      </div>

      <div className="p-6 space-y-4">
        {subtitle ? <p className="text-sm text-[#5f6266]">{subtitle}</p> : null}

        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-fit object-contain object-center rounded-md"
          />
        ) : null}

        {description.length ? (
          <div className="space-y-3">
            {description.map((paragraph, i) => (
              <p key={`${paragraph}-${i}`} className="text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}

const TextFileWindow = WindowWrapper(TextFile)

const TextWindows = () => {
  const { windows } = useWindowStore()

  const txtKeys = Object.entries(windows)
    .filter(
      ([key, win]) =>
        (key === 'txtfile' || key.startsWith('txtfile:')) && win?.isOpen
    )
    .map(([key]) => key)

  return (
    <>
      {txtKeys.map((key) => (
        <TextFileWindow key={key} windowKey={key} windowType="txtfile" />
      ))}
    </>
  )
}

export default TextWindows
