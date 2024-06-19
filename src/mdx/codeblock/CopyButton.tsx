'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 10000)
  }

  return (
    <button disabled={isCopied} onClick={copy}>
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  )
}
