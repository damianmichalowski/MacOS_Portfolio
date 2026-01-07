import { locations, navIcons, navLinks } from '#constants/index.js'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import dayjs from 'dayjs'

const Navbar = () => {
  const { openWindow } = useWindowStore()
  const { setActiveLocation } = useLocationStore()

  const handleNavClick = (type) => {
    if (type === 'finder') {
      setActiveLocation(locations.work)
      openWindow('finder')
      return
    }

    openWindow(type)
  }

  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="logo" />
        <p className="font-bold">Portfolio Damian Michałowski</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => handleNavClick(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <img src={img} className="icon-hover" alt={`icon-${id}`} />
            </li>
          ))}
        </ul>

        <time>{dayjs().format('ddd MMM D h:mm A')}</time>
      </div>
    </nav>
  )
}

export default Navbar
