import { useEffect, useState } from 'react'

export default function useResponsiveItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(9)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      if (width < 640)
        setItemsPerPage(4) // mobile
      else if (width < 1024)
        setItemsPerPage(6) // tablet
      else setItemsPerPage(9) // desktop
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return itemsPerPage
}
