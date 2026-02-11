/**
 * Reusable hook for managing expanded/collapsed state.
 * Used by DisclosurePanel and other expandable components.
 */

import { useState, useCallback } from "react";

export interface DisclosureState {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

/**
 * Hook that manages open/closed state for disclosure/accordion patterns.
 *
 * @param initialOpen - Initial state (default: false)
 * @returns Disclosure state and control functions
 *
 * @example
 * const { isOpen, toggle } = useDisclosure();
 * return (
 *   <>
 *     <button onClick={toggle}>Toggle</button>
 *     {isOpen && <Content />}
 *   </>
 * );
 */
export function useDisclosure(initialOpen = false): DisclosureState {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    toggle,
    open,
    close,
  };
}
