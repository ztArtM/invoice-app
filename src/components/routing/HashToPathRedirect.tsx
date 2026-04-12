import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLegacyInfoRouteFromHash, pathForInfoRoute } from '../../utils/infoRoutes'

/**
 * One-time migration: `#privacy` → `/privacy`, etc., so old links keep working.
 */
export function HashToPathRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const route = getLegacyInfoRouteFromHash(window.location.hash)
    if (!route) return
    navigate(pathForInfoRoute(route), { replace: true })
  }, [navigate])

  return null
}
