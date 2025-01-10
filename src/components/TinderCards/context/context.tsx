import { createContext, useContext, useState } from 'react'

type DragContextType = {
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
  isSwipeInProgress: boolean
  setIsSwipeInProgress: (swiping: boolean) => void
}

const DragContext = createContext<DragContextType | undefined>(undefined)

export const DragProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false)
  return (
    <DragContext.Provider
      value={{
        isDragging,
        setIsDragging,
        isSwipeInProgress,
        setIsSwipeInProgress,
      }}
    >
      {children}
    </DragContext.Provider>
  )
}

export const useDragContext = (): DragContextType => {
  const context = useContext(DragContext)
  if (!context) {
    throw new Error('useDragContext must be used within a DragProvider')
  }
  return context
}
