// components/Pre.tsx
import React from 'react'
import { CopyButton } from './CopyButton'

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  raw?: string
  children?: React.ReactNode
  ['data-language']?: string
}

export const Pre: React.FC<PreProps> = ({ children, raw, ...props }) => {
  const lang = props['data-language'] || 'shell'
  return (
    <pre {...props} className="p-0">
      <div className="code-header">
        {lang}
        {raw && <CopyButton text={raw} />}
      </div>
      {children}
    </pre>
  )
}
