'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(max-width: 767px)'

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot() {
  return false
}

/**
 * True below 768px. Server snapshot is always false.
 * Do not branch whole component trees (e.g. Dialog vs Drawer) on this value during the
 * initial render — wait until after mount so SSR HTML matches the first client paint.
 */
export function useClientNarrowViewport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
