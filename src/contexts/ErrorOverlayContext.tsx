import { createContext, useContext, useState, ReactNode } from 'react'

interface ErrorOverlayContextType {
  isVisible: boolean
  errorMessage: string
  show: (message: string) => void
  hide: () => void
  reload: () => void
}

const ErrorOverlayContext = createContext<ErrorOverlayContextType | undefined>(undefined)

export function ErrorOverlayProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const show = (message: string) => {
    setErrorMessage(message)
    setIsVisible(true)
  }

  const hide = () => {
    setIsVisible(false)
  }

  const reload = () => {
    window.location.reload()
  }

  return (
    <ErrorOverlayContext.Provider value={{ isVisible, errorMessage, show, hide, reload }}>
      {children}
    </ErrorOverlayContext.Provider>
  )
}

export function useErrorOverlay() {
  const context = useContext(ErrorOverlayContext)
  if (!context) {
    throw new Error('useErrorOverlay must be used within an ErrorOverlayProvider')
  }
  return context
}
