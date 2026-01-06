import useWindowStore from '#store/window'

const WindowControls = ({ target }) => {
  const { closeWindow } = useWindowStore()
  return (
    <div id="window-controls">
      <div className="close" onClick={() => closeWindow(target)} />
      <div className="minimize" />
      <div className="maximize" />
      {/* TODO add callback to min max */}
    </div>
  )
}

export default WindowControls
