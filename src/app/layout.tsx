import type { Metadata } from 'next'
import { Nanum_Gothic_Coding } from 'next/font/google'
import './globals.css'

import { QuarterCircle } from '@/components/nav/QuarterCircle'
import { NavbarMenus } from '../components/nav/NavbarMenus'
import Head from 'next/head'

const nanumGothicCoding = Nanum_Gothic_Coding({
  weight: ['400'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '하이고니.dev',
  description: '하이고니의 개발 블로그입니다.',
  verification: {
    google: 'q7_2WcXhqP60Arbc77AyGpiDkzMxRJ-DNfH3pxHGtMc',
  },
  other: {
    'naver-site-verification': 'd938699fac673abb350f6ede9cf218e8ec8717ae',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={nanumGothicCoding.className}>
        <div className="blur-box" />

        <div className="main-box">
          <div className="double-border flex flex-row justify-between mb-4">
            <div className="flex flex-col justify-between">
              <span className="sm:text-md md:text-3xl font-extrabold">
                NO PROBLEM IS A BIG PROBLEM
              </span>
              <NavbarMenus />
            </div>
            <QuarterCircle />
          </div>
          {children}
        </div>
        {/* <div className="flex flex-col justify-start items-center">
            <div>하이고니</div>
          </div> */}
      </body>
    </html>
  )
}
