import { useEffect, useState } from 'react'

export function useDelayedSpinner(loading: boolean, delay = 150): boolean {
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    if (!loading) {
      setShowSpinner(false)
      return
    }
    const timer = setTimeout(() => setShowSpinner(true), delay)
    return () => clearTimeout(timer)
  }, [loading, delay])

  return loading && showSpinner
}
