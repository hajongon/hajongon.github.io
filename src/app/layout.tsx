import type { Metadata } from 'next'
import { Nanum_Gothic_Coding } from 'next/font/google'
import './globals.css'

import { QuarterCircle } from '@/components/nav/QuarterCircle'
import { NavbarMenus } from '../components/nav/NavbarMenus'

const nanumGothicCoding = Nanum_Gothic_Coding({
  weight: ['400'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={nanumGothicCoding.className}>
        {/* <div className="vintage-line m-4"></div> */}
        <div className="center-container">
          <div className="main-box double-border flex flex-row justify-between mb-4">
            <div className="flex flex-col justify-between">
              <span className="sm:text-sm md:text-2xl font-extrabold">
                NO PROBLEM IS A BIG PROBLEM
              </span>
              <NavbarMenus />
            </div>
            <QuarterCircle />
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
