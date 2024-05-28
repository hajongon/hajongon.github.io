import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import fs from 'fs'
import matter from 'gray-matter'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// MDX 파일 파싱 : abstract / detail 구분
export const parsePost = async (postPath: string) => {
  const file = fs.readFileSync(postPath, 'utf-8')
  const { data, content } = matter(file)
  console.log(data, content)
}
