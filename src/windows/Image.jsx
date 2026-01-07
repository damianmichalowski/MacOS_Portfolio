import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'

const ImageFile = ({ windowKey }) => {
  const { windows } = useWindowStore()
  const data = windows?.[windowKey]?.data

  if (!data) return null

  const title = data.name
  const imageUrl = data.imageUrl

  return (
    <>
      <div id="window-header">
        <WindowControls target={windowKey} />
        <h2>{title}</h2>
      </div>

      <div className="preview">
        {imageUrl ? <img src={imageUrl} alt={title} /> : null}
      </div>
    </>
  )
}

const ImageFileWindow = WindowWrapper(ImageFile)

const ImageWindows = () => {
  const { windows } = useWindowStore()

  const imgKeys = Object.entries(windows)
    .filter(
      ([key, win]) =>
        (key === 'imgfile' || key.startsWith('imgfile:')) && win?.isOpen
    )
    .map(([key]) => key)

  return (
    <>
      {imgKeys.map((key) => (
        <ImageFileWindow key={key} windowKey={key} windowType="imgfile" />
      ))}
    </>
  )
}

export default ImageWindows
