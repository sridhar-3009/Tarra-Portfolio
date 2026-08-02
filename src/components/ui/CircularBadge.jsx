import React from 'react'

export default function CircularBadge({ text = 'code • ml • research • build • ' }) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex h-28 w-28 md:h-32 md:w-32 items-center justify-center pointer-events-none select-none">
      <div className="relative flex items-center justify-center w-full h-full animate-spin-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
          <text className="text-[10px] font-mono tracking-widest fill-zinc-900 dark:fill-zinc-200 uppercase font-bold">
            <textPath xlinkHref="#circlePath" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-white shadow-sm animate-ping" />
      <div className="absolute w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" />
    </div>
  )
}
