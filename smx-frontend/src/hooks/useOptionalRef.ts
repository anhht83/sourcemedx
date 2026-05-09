'use client'

import { RefObject, useRef } from 'react'

export function useOptionalRef<T extends HTMLElement>(
  externalRef?: RefObject<T | null>,
): RefObject<T | null> {
  const internalRef = useRef<T>(null)
  return externalRef ?? internalRef
}
