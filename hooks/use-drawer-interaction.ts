import { useCallback, useEffect, useReducer, useRef } from "react"

export type DrawerTab = "publications" | "photography"

type DrawerState =
  | { mode: "closed"; tab: null }
  | { mode: "hover" | "pinned"; tab: DrawerTab }

type DrawerAction =
  | { type: "hover-open" | "open" | "toggle"; tab: DrawerTab }
  | { type: "hover-close" | "close" }

function reduceDrawer(state: DrawerState, action: DrawerAction): DrawerState {
  switch (action.type) {
    case "hover-open":
      return state.mode === "pinned" ? state : { mode: "hover", tab: action.tab }
    case "hover-close":
      return state.mode === "hover" ? { mode: "closed", tab: null } : state
    case "open":
      return { mode: "pinned", tab: action.tab }
    case "toggle":
      return state.mode === "pinned" && state.tab === action.tab
        ? { mode: "closed", tab: null }
        : { mode: "pinned", tab: action.tab }
    case "close":
      return { mode: "closed", tab: null }
  }
}

export function useDrawerInteraction(initialTab: DrawerTab | null = null) {
  const [state, dispatch] = useReducer(reduceDrawer, initialTab, (tab): DrawerState => (
    tab ? { mode: "pinned", tab } : { mode: "closed", tab: null }
  ))
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelOpen = useCallback(() => {
    if (openTimer.current !== null) clearTimeout(openTimer.current)
    openTimer.current = null
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }, [])

  const reset = useCallback((tab: DrawerTab | null) => {
    cancelOpen()
    cancelClose()
    dispatch(tab ? { type: "open", tab } : { type: "close" })
  }, [cancelOpen, cancelClose])

  const open = useCallback((tab: DrawerTab) => reset(tab), [reset])
  const close = useCallback(() => reset(null), [reset])

  const toggle = useCallback((tab: DrawerTab) => {
    cancelOpen()
    cancelClose()
    dispatch({ type: "toggle", tab })
  }, [cancelOpen, cancelClose])

  const hoverOpen = useCallback((tab: DrawerTab) => {
    cancelOpen()
    cancelClose()
    openTimer.current = setTimeout(() => {
      openTimer.current = null
      dispatch({ type: "hover-open", tab })
    }, 100)
  }, [cancelOpen, cancelClose])

  const hoverClose = useCallback(() => {
    cancelOpen()
    cancelClose()
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null
      dispatch({ type: "hover-close" })
    }, 200)
  }, [cancelOpen, cancelClose])

  useEffect(() => () => {
    cancelOpen()
    cancelClose()
  }, [cancelOpen, cancelClose])

  return {
    tab: state.tab,
    open,
    close,
    toggle,
    reset,
    hover: { enter: hoverOpen, leave: hoverClose, retain: cancelClose, cancelEnter: cancelOpen },
  }
}
