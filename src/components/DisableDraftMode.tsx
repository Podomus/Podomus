'use client'

import { useTransition } from 'react'
import { disableDraftMode } from '@/app/actions'
import { useIsPresentationTool } from 'next-sanity/hooks'

export function DisableDraftMode() {
  const [pending, startTransition] = useTransition()
  const isPresentationTool = useIsPresentationTool()

  // Only show outside of Presentation Tool
  if (isPresentationTool === null || isPresentationTool === true) {
    return null
  }

  const disable = () => startTransition(() => disableDraftMode())

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {pending ? (
        <span className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
          Disabling draft mode...
        </span>
      ) : (
        <button
          type="button"
          onClick={disable}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm shadow-lg hover:opacity-90 transition"
        >
          Exit Preview
        </button>
      )}
    </div>
  )
}
